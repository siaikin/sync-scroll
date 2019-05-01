import {Area} from "./area";

export class ScrollControl {

    _sign = 1;
    _curFrag;
    _areas;
    _options;

    constructor(options) {
        this._options   = options;

        this._areas     = [];
    }

    /**
     * 添加`Area`
     * @param el - 对应的DOM元素
     * @param queryCriteria - 查询字符串
     * @param options
     */
    addArea(el, queryCriteria, options) {
        const area = new Area(this, el, queryCriteria, options || this._options);
        this._areas.push(area);
    }

    /**
     * 以`syncArea`为参照，进行同步滚动。
     * @param syncArea - 参照的`Area`
     * @param offsetOptions
     */
    syncScroll(syncArea, offsetOptions) {
        this._curFrag = syncArea.currentFragment();

        const scrollTop = syncArea.scrollTop;
        for (let i = 0, length = this._areas.length; i < length; i++) {
            if (syncArea === this._areas[i]) { continue; }

            this._areas[i].syncWith(this._curFrag, scrollTop, offsetOptions);
        }
    }

    updateAreas() {
        let area;
        for (let i = 0, length = this._areas.length; i < length; i++) {
            area = this._areas[i];

            area.updateFragments();
        }
    }

    destroyAreas() {
        this._areas.forEach(function (area) {
            area.destoryArea();
        })
    }

    /**
     * 判断互斥锁状态
     * @returns {boolean}
     */
    isLocked() {
        return !(this._sign === 1);
    }

    /**
     * 加锁
     */
    lock() {
        this._sign = this._sign - this._areas.length + 1;
    }

    /**
     * 解锁
     */
    unlock() {
        this._sign = this._sign + 1;
    }
}
