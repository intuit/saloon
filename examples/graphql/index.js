import util from 'util';

import server from '../../server';
import { seed, setDefinitions } from '../../src/main';
import { bobBelcher } from './personas';
import definitions from './definitions';

server.ready.then(() => {
  setDefinitions(definitions);
  seed(bobBelcher).then((output) => {
    console.log('Output data', util.inspect(output, false, 20, true)); // eslint-disable-line no-console
    process.exit();
  });
});
