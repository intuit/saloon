import defaultsDeep from 'lodash.defaultsdeep';

import getRequestAdapter from './requestAdapters';
import logger from './logger';
import DefinitionRegistry from './definitions';
import OutputStore from './output';
import parsePersona from './preprocessor';

const MAX_RETRY_ATTEMPTS = 3;

/**
 * The seeder. The big kahuna.
 * @class
 */
class Seeder {
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
  async seed(persona, cb = () => {}) {
    logger.info('Init Seeding');

    const parsedPersona = parsePersona(persona);
    this._output.clear();
    this._retries = {};
    await this._save(parsedPersona);
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
    const newParentData = { ...parentData };

    const execute = (resource, definition, resolve, reject) => {
      // const data = defaultsDeep(resource.params, definition.body);

      logger.info(`Seeding ${resource.type}`);
      // logger.debug(data);

      // getRequestAdapter(definition)
      //   .execute(data)
      //   .then(this._saveSuccess.bind(this, resource, resolve, newParentData))

      getRequestAdapter(definition, resource)
        .constructPayload()
        .execute()
        .then(this._saveSuccess.bind(this, resource, resolve, newParentData))
        .catch((e) => {
          if (!this._retries[resource.id]) {
            this._retries[resource.id] = 0;
          }
          this._retries[resource.id] += 1;

          if (this._retries[resource.id] < MAX_RETRY_ATTEMPTS) {
            logger.warn(`Could not seed ${resource.type} on attempt #${this._retries[resource.id]}, retrying...`);
            execute.call(this, resource, definition, resolve, reject);
          } else {
            this._saveError(resource, reject, e);
          }
        });
    };

    const promises = await this._resourceIterator(resources, newParentData, execute);

    return Promise.all(promises)
      .then(values => Promise.all(values.map(({ resources, newParentData }) => (resources ? this._save(resources, newParentData) : null))));
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
    const newParentData = { ...parentData };
    if (!response) {
      logger.warn(`Nothing returned by resource API: ${resource.type}`);
    }
    this._output.insert(resource.path, response.data);
    logger.info(`Finished seeding ${resource.type}`);
    newParentData[resource.type] = response.data;
    resolve({ resources: resource.children, newParentData });
  }

  /**
     * Error handler for a single resource's request.
     * @param {Object} resource The resource being saved.
     * @param {function} reject The reject function for the resource.
     * @param {Object} error The response's error object.
     * @access private
     */
  _saveError(resource, reject, error) { // eslint-disable-line class-methods-use-this
    reject(error);
    logger.warn(`Error seeding ${resource.type}: ${error}`);
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
