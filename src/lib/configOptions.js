export class ConfigOptions {

    static DEFAULT_OPTIONS = {
        syncWithClick: false,
        offsetScroll: 0
    };

    constructor(
        options
    ) {
        Object.setPrototypeOf(options, null);
        this['syncWithClick']    = options['syncWithClick']  || false;
        this['offsetScroll']     = options['offsetScroll']   || 0;
    }

    static instance(options) {
        return options ? new ConfigOptions(options) : ConfigOptions.DEFAULT_OPTIONS;
    }
}
