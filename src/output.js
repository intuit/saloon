/**
 * A store for keeping track of and processing of all seeding output.
 * @class
 */
export default class OutputStore {
    constructor() {

        /**
         * The output store.
         * @type {Object}
         * @access private
         */
        this._store = {};
    }

    /**
     * Adds additional seeded values to the store.
     * @param {Object} values 
     * @access public
     */
    set(values) {
        this._store = Object.assign(this._store, values);
    }

    /**
     * Simple getter for the store.
     * @returns {Object} The store.
     * @access public
     */
    get() {
        return this._store;
    }

    /**
     * Recursively processes output params and inserts requested data to the store.
     * @param {Object} data Response data.
     * @param {Object|Array|String} params Outputs requested from the persona.
     * @access public
     */
    insert(data, params) {
        let output = {};

        function addVal(val) {
            if (typeof val !== 'object') {
                output[val] = data[val];
            } else {
                Object.keys(val).forEach(key => {
                    output[key] = data[val[key]];
                });
            }
        }

        if (params) {
            if (Array.isArray(params)) {
                params.forEach(addVal);
            } else {
                addVal(params);
            }
        }

        this.set(output);
    }

    /**
     * Empties the output store.
     * @access public
     */
    clear() {
        this._store = {};
    }
}