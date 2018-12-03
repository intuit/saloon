export default class BaseRequestAdapter {
  constructor(definition, resource) {
    this._resource = resource;
    this._definition = definition;
    this._payload = {};
  }
}
