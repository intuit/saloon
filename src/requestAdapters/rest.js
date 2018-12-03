import axios from 'axios';
import defaultsDeep from 'lodash.defaultsdeep';
import BaseRequestAdapter from './Base';

class RestAdapter extends BaseRequestAdapter {
  constructPayload() {
    this._payload = defaultsDeep(this._resource.params, this._definition.body);
    return this;
  }

  execute() {
    const { method = 'post', url, headers = {} } = this._definition;

    return axios({
      method,
      url,
      headers,
      data: this._payload,
    });
  }
}

export default RestAdapter;
