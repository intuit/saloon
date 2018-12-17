import RestAdapter from './Rest';
import GraphqlAdapter from './Graphql';

const DEFAULT_ADAPTER = 'rest';

export const requestAdapters = {
  rest: RestAdapter,
  graphql: GraphqlAdapter,
};

export default function getRequestAdapter(definition, resource) {
  const Adapter = requestAdapters[definition.query ? 'graphql' : DEFAULT_ADAPTER];
  return new Adapter(definition, resource);
}
