import axios from 'axios';
import BaseRequestAdapter from './Base';

class GraphqlAdapter extends BaseRequestAdapter {
  constructPayload() {
    this._payload = this._resource.params;
    return this;
  }

  execute() {
    const { url, headers = {}, variables } = this._definition;

    return axios({
      method: 'post',
      url,
      headers,
      data: {
        query: this._payload,
        variables,
      },
    })
      .then(({ data }) => data);
  }
}

export default GraphqlAdapter;
