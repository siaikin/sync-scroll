export class Fragment {

    pairId;
    _el;
    offsetTop;
    height;

    constructor(
        pairId,
        el,
        offsetTop,
        height
    ) {
        this.pairId     = pairId;
        this._el       = el;
        this.offsetTop  = offsetTop;
        this.height     = height;
    }
}
