import axios from 'axios';

export default function restAdapter(definition, data) {
  return axios({
    method: definition.method || 'post',
    url: definition.url,
    headers: definition.headers || {},
    data,
  });
}
