import restAdapter from './rest';

const DEFAULT_ADAPTER = 'rest';

const requestAdapters = {
  rest: restAdapter,
};

export default function getRequestAdapter(resource) {
  return {
    execute: requestAdapters[resource.transport || DEFAULT_ADAPTER],
  };
}
