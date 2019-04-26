import {Fragment} from "./fragment";

export class Area {

    _syncControl;
    _el;
    _queryCriteria;
    _fragmentObj;

    get scrollTop() {
        return this._el.scrollTop;
    }

    constructor(
        syncControl,
        el,
        queryCriteria
    ) {
        this._syncControl       = syncControl;
        this._el               = el;
        this._queryCriteria    = queryCriteria;

        this._updateFrags();
        this._listen();
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

        this._fragmentObj = {};
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
            this._fragmentObj[i] = frag;
        }

        // handle last item
        el = els[length -1];
        frag = new Fragment(
            length - 1,
            el,
            offsetTopArr[length - 1],
            scrollHeight - offsetTopArr[length - 1]
        );
        this._fragmentObj[length - 1] = frag;
    }

    _curFrag() {
        const scrollTop = this._el.scrollTop;

        const curFrag = Object.values(this._fragmentObj).reduce((previousValue, currentValue) => {
            if (currentValue.offsetTop > scrollTop) { return previousValue; }

            if ((scrollTop - previousValue.offsetTop) > (scrollTop - currentValue.offsetTop)) {
                return currentValue;
            } else {
                return previousValue;
            }
        });

        return curFrag;
    }

    syncWith(pairFrag, scrollTop) {
        const deltaHeight = scrollTop - pairFrag.offsetTop;

        let frag;
        frag = this._fragmentObj[pairFrag.pairId];

        const _scrollTop = frag.offsetTop + (frag.height / pairFrag.height) * deltaHeight;

        this._el.scrollTop = _scrollTop;
    }

    _listen() {
        this._el.addEventListener('scroll', (ev) => {
            if (this._syncControl.isLocked()) {
                this._syncControl.unlock();
            } else {
                this._syncControl.lock();
                // 让其他`Area`以这个`Area`为标准进行同步滚动
                this._syncControl.syncScroll(this);
            }
        });
    }

    updateFragments() {
        this._updateFrags();
    }

    currentFragment() {
        return this._curFrag();
    }
}
