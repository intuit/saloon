/* eslint-env node */
/* eslint import/no-extraneous-dependencies: 0 */

import restify from 'restify'; // eslint-disable-line

import restApi from './restApi';
import graphqlApi from './graphqlApi';

/**
 * SERVER
 */
const port = process.env.PORT || 3000;
const server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

restApi(server);
graphqlApi(server);

/**
 * START 'ER UP
 */
export default {
  ready: new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) {
        console.error(err); // eslint-disable-line no-console
        reject();
      } else {
        resolve();
      }
    });
  }),
};
