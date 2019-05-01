export class ConfigOptions {

    constructor(
        options
    ) {
        Object.setPrototypeOf(options, null);
        this['syncWithClick']    = options['syncWithClick']  || false;
        this['offsetScroll']     = options['offsetScroll']   || 0;
    }
}
