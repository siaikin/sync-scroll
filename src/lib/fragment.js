export class Fragment {

    pairId;
    el;
    offsetTop;
    height;

    constructor(
        pairId,
        el,
        offsetTop,
        height
    ) {
        this.pairId     = pairId;
        this.el         = el;
        this.offsetTop  = offsetTop;
        this.height     = height;
    }
}
