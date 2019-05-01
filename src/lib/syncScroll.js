import {ScrollControl} from "./scrollControl";

export class SyncScroll {

    controller;
    areas;

    constructor(
        options
    ) {
        this.controller = new ScrollControl(options);
        this.areas = this.controller._areas;
    }

    addAreas(areasInfo) {
        for (let i = areasInfo.length; i--;) {
            this.addArea(areasInfo[i]);
        }
        this.update();
    }

    addArea(areaInfo) {
        this.controller.addArea(areaInfo.area, areaInfo.queryCriteria, areaInfo.options);
    }

    update() {
        this.controller.updateAreas();
    }

    destory() {
        this.controller.destroyAreas();
    }
}
