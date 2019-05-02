import {Fragment} from "./fragment";

export class Area {

    /**
     * control类的引用
     */
    _syncControl;
    /**
     * Dom对象
     */
    _el;
    /**
     * 查询语句
     */
    _queryCriteria;
    _options;
    _fragMap;
    _frags;
    /**
     * 当前对齐的`Fragment`
     */
    _curFrag;
    /**
     * 对齐偏移参数
     */
    _ofstOps;

    get scrollTop() {
        return this._el.scrollTop;
    }
    set scrollTop(scrollTop) {
        this._el.scrollTop = scrollTop;
    }

    currentFragment() {
        return this._curFrag;
    }

    constructor(
        syncControl,
        el,
        queryCriteria,
        options
    ) {
        this._syncControl       = syncControl;
        this._el                = el;
        this._queryCriteria     = queryCriteria;
        this._options           = options;

        this._ofstOps = {
            ofstScl: this._options.offsetScroll,
            ofstFrag: 0
        };
        this._listen();

        // if (!Area.prototype.hasOwnProperty('scrollTop')) {
        //     Object.defineProperty(Area.prototype, 'scrollTop', {
        //         get() {
        //             return this._el.scrollTop;
        //         },
        //         set(scrollTop) {
        //             this._el.scrollTop = scrollTop;
        //         },
        //         configurable: true,
        //         enumerable: true
        //     })
        // }
    }

    /**
     * update fragments
     * @private
     */
    _updateFrags() {
        if (!this._el || !this._queryCriteria) { return; }

        let scrollHeight = this._el.scrollHeight;
        const els = this._el.querySelectorAll(this._queryCriteria);

        const length = els.length, offsetTopArr = [];
        for (let i = 0; i < length; i++) {
            offsetTopArr.push(els[i].offsetTop);
        }

        this._fragMap = {};
        this._frags = [];
        let el, frag, offsetTop;
        for (let i = 0; i < length - 1; i++) {
            el = els[i];
            offsetTop = offsetTopArr[i];
            frag = new Fragment(
                i,
                el,
                offsetTop,
                offsetTopArr[i + 1] - offsetTop
            );
            this._fragMap[i] = frag;
            this._frags.push(frag);
        }

        // handle last item
        el = els[length -1];
        frag = new Fragment(
            length - 1,
            el,
            offsetTopArr[length - 1],
            scrollHeight - offsetTopArr[length - 1]
        );
        this._fragMap[length - 1] = frag;
        this._frags.push(frag);
    }

    /**
     * 通过给定的偏移量确定`片段`位置
     * @param offset
     * @private
     */
    _locateByOffset(offset) {
        let curFrag, frags = this._frags;

        for (let start = 0, end = frags.length - 1, mid; start < end - 1;) {
            mid = (start + end) >> 1;
            if (offset >= frags[mid].offsetTop) {
                if (frags[mid + 1].offsetTop > offset) {
                    curFrag = frags[mid];
                    break;
                } else {
                    start = mid;
                }
            } else if (frags[mid - 1].offsetTop <= offset) {
                curFrag = frags[mid - 1];
                break;
            } else {
                end = mid;
            }
        }
        return curFrag ? curFrag : frags[frags.length - 1];
    }

    _topFrag(ofstOps) {
        const scrollTop = this.scrollTop + ofstOps.ofstScl;
        return this._locateByOffset(scrollTop);
    }

    _listen() {
        this._el.addEventListener('scroll', this._onScroll.bind(this));

        if (this._options.syncWithClick) {
            this._el.addEventListener('click', this._onClick.bind(this));
        }
    }

    _rmListen() {
        this._el.removeEventListener('scroll', this._onScroll);

        if (this._options.syncWithClick) {
            this._el.removeEventListener('click', this._onClick);
        }
    }

    _onClick(event) {
        if (this._syncControl.isLocked()) {
            this._syncControl.unlock();
        } else {
            this._syncControl.lock();
            let tOsTop = event.target.offsetTop;
            this._curFrag = this._locateByOffset(tOsTop);

            // 让其他`Area`以这个`Area`为标准进行同步滚动
            this._syncControl.syncScroll(this, {
                ofstScl: this._curFrag.offsetTop - this.scrollTop,
                ofstFrag: tOsTop - this._curFrag.offsetTop
            });
        }
    }

    _onScroll(event) {
        if (this._syncControl.isLocked()) {
            this._syncControl.unlock();
        } else {
            this._syncControl.lock();
            this._curFrag = this._topFrag(this._ofstOps);
            this._ofstOps.ofstFrag = 0;
            // 让其他`Area`以这个`Area`为标准进行同步滚动
            this._syncControl.syncScroll(this, this._ofstOps);
        }
    }

    syncWith(pairFrag, scrollTop, ofstOps) {
        const deltaHeight = scrollTop - pairFrag.offsetTop + ofstOps.ofstScl;

        let frag = this._fragMap[pairFrag.pairId],
            ratio = frag.height / pairFrag.height;

        const _scrollTop = frag.offsetTop   +
            ratio * deltaHeight             +
            (ratio * ofstOps.ofstFrag - ofstOps.ofstFrag);

        this.scrollTop = _scrollTop - ofstOps.ofstScl;
    }

    updateFragments() {
        this._updateFrags();
    }

    destory() {
        this._rmListen();
    }
}
