import server from '../../server';
import { seed, setDefinitions, setLoggingLevel } from '../../src/main';
import personas from './personas';
import definitions from './definitions';

server.ready.then(() => {
  const persona = personas['homer_simpson'];

  setLoggingLevel('info');
  setDefinitions(definitions);
  seed(persona)
    .then(output => {
      console.log('Output data', output); // eslint-disable-line no-console
      process.exit();
    });
});
