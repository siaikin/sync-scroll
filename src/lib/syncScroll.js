import {ScrollControl} from "./scrollControl";

export class SyncScroll {

    controller;
    areas;

    constructor() {
        this.controller = new ScrollControl();
        this.areas = this.controller._areas;
    }

    addArea(el, queryCriteria) {
        this.controller.addArea(el, queryCriteria);
    }

    update() {
        this.controller.updateAreas();
    }
}
