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

    _topFrag(ofstOps) {
        const scrollTop = this.scrollTop + ofstOps.ofstScl;

        const curFrag = Object.values(this._fragMap).reduce((previousValue, currentValue) => {
            if (currentValue.offsetTop > scrollTop) { return previousValue; }

            if ((scrollTop - previousValue.offsetTop) > (scrollTop - currentValue.offsetTop)) {
                return currentValue;
            } else {
                return previousValue;
            }
        });

        return curFrag;
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
            const target = event.target;
            let frag, tOsTop = target.offsetTop;
            for (let i = 0, length = this._frags.length; i < length; i++) {
                frag = this._frags[i];
                if (tOsTop < frag.offsetTop + frag.height) {
                    break;
                }
            }

            this._curFrag = frag;
            // 让其他`Area`以这个`Area`为标准进行同步滚动
            this._syncControl.syncScroll(this, {
                ofstScl: frag.offsetTop - this.scrollTop,
                ofstFrag: tOsTop - frag.offsetTop
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
