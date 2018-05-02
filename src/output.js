import { set } from 'lodash';
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
  insert(parentPath, data) {
    set(this._store, parentPath, data);
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
   * Empties the output store.
   * @access public
   */
  clear() {
    this._store = {};
  }
}
