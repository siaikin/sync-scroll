import {ScrollControl} from "./scrollControl";
import {ConfigOptions} from "./configOptions";

export class SyncScroll {

    controller;
    areas;

    constructor(
        options = ConfigOptions.DEFAULT_OPTIONS
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
