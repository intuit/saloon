import axios from 'axios';
import defaultsDeep from 'lodash.defaultsdeep';
import BaseRequestAdapter from './Base';

class GraphqlAdapter extends BaseRequestAdapter {
  constructPayload() {
    this._query = this._definition.query;
    this._variables = defaultsDeep(this._resource.params, this._definition.variables);

    return this;
  }

  execute() {
    const { url, headers = {} } = this._definition;

    return axios({
      method: 'post',
      url,
      headers,
      data: {
        query: this._query,
        variables: this._variables,
      },
    })
      .then(({ data }) => {
        if (!data.data && data.errors.length > 0) {
          throw new Error(JSON.stringify(data.errors));
        }
        return data;
      });
  }
}

export default GraphqlAdapter;
