import {Fragment} from "./fragment";

export class Area {

    _syncScroll;
    _el;
    _queryCriteria;
    _fragments = [];

    get scrollTop() {
        return this._el.scrollTop;
    }

    constructor(
        syncScroll,
        el,
        queryCriteria
    ) {
        this._syncScroll       = syncScroll;
        this._el               = el;
        this._queryCriteria    = queryCriteria;

        this._updateFrags();
        this._listen();
    }

    _updateFrags() {
        if (!this._el || !this._queryCriteria) { return; }

        const els = this._el.querySelectorAll(this._queryCriteria);
        // els.sort((a, b) => a.offsetTop - b.offsetTop);

        this._fragments = [];
        let el, frag;
        for (let i = 0; i < els.length; i++) {
            el = els[i];
            frag = new Fragment(
                i,
                el,
                el.offsetTop,
                ((i + 1 < els.length) ? els[i + 1].offsetTop : this._el.scrollHeight) - el.offsetTop
            );
            this._fragments.push(frag);
        }
    }

    _curFrag() {
        const scrollTop = this._el.scrollTop;

        const curFrag = this._fragments.reduce((previousValue, currentValue) => {
            if (currentValue.offsetTop > scrollTop) { return previousValue; }

            if ((scrollTop - previousValue.offsetTop) > (scrollTop - currentValue.offsetTop)) {
                return currentValue;
            } else {
                return previousValue;
            }
        });

        return curFrag;
    }

    syncWith(area) {
        const pairFrag = area.currentFragment();
        const deltaHeight = area.scrollTop - pairFrag.offsetTop;

        let frag;
        for (let i = 0; i < this._fragments.length; i++) {
            if (this._fragments[i].pairWith(pairFrag.pairId)) {
                frag = this._fragments[i];
                break;
            }
        }
        const _scrollTop = frag.offsetTop + (frag.height / pairFrag.height) * deltaHeight;
        // console.log(_scrollTop, frag.height, (frag.height / pairFrag.height), area.scrollTop, pairFrag.offsetTop);

        this._el.scrollTop = _scrollTop;
    }

    _listen() {
        this._el.addEventListener('scroll', (ev) => {
            if (this._syncScroll.isLocked()) {
                this._syncScroll.unlock();
            } else {
                this._syncScroll.lock();
                this._syncScroll.syncScroll(this);
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
