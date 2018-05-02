import util from 'util';

import server from '../../server';
import { seed, setDefinitions, setLoggingLevel } from '../../src/main';
import personas from './personas';
import definitions from './definitions';


server.ready.then(() => {
  const persona = personas.bart_simpson;
  setLoggingLevel('info');
  setDefinitions(definitions);
  seed(persona).then((output) => {
    console.log('Output data', util.inspect(output, false, 20, true)); // eslint-disable-line no-console
    process.exit();
  });
});
