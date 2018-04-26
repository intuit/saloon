import axios from 'axios';
import { expressionEvaluator } from './expressions';
import logger from './logger';
import { templateProcessor } from './templates';
import DefinitionRegistry from './definitions';
import OutputStore from './output';

/**
 * Returns the supplied children or those generated from a template.
 * @param {Object} resource The seeded parent resource.
 * @returns {Array} Children resources
 */
function getChildren(resource) {
    return resource.childrenTemplate ? templateProcessor(resource) : resource.children;
}

/**
 * The seeder. The big kahuna.
 * @class
 */
export class Seeder {
    constructor() {
        this._definitions = new DefinitionRegistry();
        this._output = new OutputStore();
    }

    /**
     * Set the definitions.
     * @param {Object[]} [definitions=[]] Supplied definitions
     * @access public
     */
    setDefinitions(definitions = []) {
        this._definitions.set(definitions);
    }

    /**
     * The main entry point for seeding, returns a promise or can be supplied a callback.
     * @param {Object} persona The persona to seed
     * @param {function} [cb=function(){}] Callback, if supplied, to run after seeding.
     * @returns {Object} A promise that's resolved or rejected once finished seeding.
     * @access public
     * @async
     */
    async seed(persona, cb = function() {}) {
        logger.info('Init Seeding');

        this._output.clear();

        await this._save(persona);
        const output = this._output.get();
        
        logger.info('Finished Seeding');
        logger.debug(output);

        cb(output);
        return output;
    }

    /**
     * Recursive function for seeding a resource.
     * @param {Object[]} resources Resources to iterate through and generate.
     * @param {Object} [parentData={}] Data from parent resources requested by the persona's output property.
     * @returns {Object} A promise.all of each child resource, each being resolved on `axios` request success.
     * @access private
     * @async
     */
    async _save(resources, parentData = {}) {
        parentData = Object.assign({}, parentData);

        const promises = await this._resourceIterator(
            resources,
            parentData,
            (resource, definition, resolve, reject) => {

            let data = Object.assign({}, resource.params, definition.body || {});
            data = expressionEvaluator(data);

            logger.info(`Seeding ${resource.id}`);
            logger.debug(data);

            axios({
                method: definition.method || 'post',
                url: definition.url,
                headers: definition.headers || {},
                data
            })
                .then(this._saveSuccess.bind(this, resource, resolve, parentData))
                .catch(this._saveError.bind(this, resource, reject));
        });

        return Promise.all(promises)
            .then(values => {
                return Promise.all(values.map(({ resources, parentData }) => {
                    return resources ? this._save(resources, parentData) : null;
                }));
            });
    }

    /**
     * Success handler for a single resource's request.
     * @param {Object} resource The resource being saved.
     * @param {function} resolve The resolve function for the resource.
     * @param {Object} parentData The parent data for entire persona.
     * @param {Object} response The request response.
     * @access private
     */
    _saveSuccess(resource, resolve, parentData, response) {
        if (!response) {
            logger.warn(`Nothing returned by resource API: ${resource.type}`);
        }

        logger.info(`Finished seeding ${resource.id}`);

        this._output.insert(response.data, resource.output);
        parentData[resource.type] = response.data;
        resolve({ resources: getChildren(resource), parentData });
    }

    /**
     * Error handler for a single resource's request.
     * @param {Object} resource The resource being saved.
     * @param {function} reject The reject function for the resource.
     * @param {Object} error The response's error object.
     * @access private
     */
    _saveError(resource, reject, error) {
        reject(error);
        logger.warn(`Error seeding ${resource.id}: ${error}`);
    }

    /**
     * A helper function for iterating through resource children and generating its promise and definition. Also handles throttling.
     * @param {Array} resources All child personas to seed.
     * @param {Object} parentData The parent data for entire persona.
     * @param {function} cb Function supplied by _seed method for calling after throttling for each resource.
     * @returns {Object[]} An array of promises for each resource.
     * @access private
     */
    _resourceIterator(resources, parentData, cb) {
        const promises = [];

        resources.forEach((resource, i) => {

            promises.push(new Promise((resolve, reject) => {
                const definition = this._definitions.get(resource, parentData);

                if (!definition) {
                    logger.warn(`Could not find resource: ${resource.type}`);
                    resolve({ resources: resources[i].children });
                    return;
                }

                setTimeout(() => {
                    cb(resource, definition, resolve, reject);
                }, (definition.throttle || 0) * i);
            }));
        });

        return promises;
    }
}

const seeder = new Seeder();
export default seeder;