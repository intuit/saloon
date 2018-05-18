import util from 'util';

import server from '../../server';
import { seed, setDefinitions, setLoggingLevel } from '../../src/main';
import { bartSimpson } from './personas';
import definitions from './definitions';

server.ready.then(() => {
  setLoggingLevel('info');
  setDefinitions(definitions);
  seed(bartSimpson).then((output) => {
    console.log('Output data', util.inspect(output, false, 20, true));
    process.exit();
  });
});
