export default class BaseRequestAdapter {
  constructor(definition, resource) {
    this._resource = resource;
    this._definition = definition;
    this._payload = {};

    if (typeof this.constructPayload === 'undefined') {
      throw new Error('Request adapter must have `constructPayload` method.');
    }

    if (typeof this.execute === 'undefined') {
      throw new Error('Request adapter must have `execute` method.');
    }
  }
}
