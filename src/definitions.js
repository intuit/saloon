import logger from './logger';

/**
 * A registry for inserting and retrieving definitions.
 * @class
 */
export default class DefinitionRegistry {
    constructor() {
        this._definitions = [];
    }

    /**
     * Inserts an array of definitions or single definition into the registry.
     * @param {Object[]|Object} definitions
     * @access public
     */
    set(definitions) {
        if (Array.isArray(definitions)) {
            this._definitions = this._definitions.concat(definitions);
        } else {
            this._definitions.push(definitions);
        }
    }

    /**
     * Getter for a definition. Handles dynamic callbacks as definition properties.
     * @param {Object} resource The persona object that needs a definition.
     * @param {*} parentData The parent data for entire persona.
     * @returns {Object} The processed definition.
     * @access public
     */
    get(resource, parentData) {
        const definition = this._definitions.find(def => def.type === resource.type);
        
        if (!definition) {
            logger.warn(`Definition could not be found: ${resource.type}`);
            return;
        }

        const { ...def } = definition; // eslint-disable-line no-unused-vars

        for (const key in def) {
            if (typeof def[key] === 'function') {
                def[key] = def[key](parentData);
            }
        }

        return def;
    }

    /**
     * Clears all definitions from the registry.
     * @access public
     */
    clear() {
        this._definitions = [];
    }
}