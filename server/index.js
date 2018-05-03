// eslint-disable import/no-extraneous-dependencies
import restify from 'restify'; // eslint-disable-line import/no-extraneous-dependencies
import _ from 'lodash'; // eslint-disable-line import/no-extraneous-dependencies


/**
 * COLLECTIONS
 */
const users = [];
const firms = [];
const clients = [];
const returns = [];


/**
 * ROUTER
 */
const router = (server) => {
  server.post('/api/user', (req, res, next) => {
    const newUser = req.params;

    newUser.user_id = '123';
    users.push(newUser);

    res.send(201, newUser);
    return next();
  });

  server.post('/api/firm', (req, res, next) => {
    const newFirm = req.params;
    newFirm.firm_id = '321';
    firms.push(newFirm);
    res.send(201, newFirm);
    return next();
  });

  server.post('/api/client', (req, res, next) => {
    const newClient = req.params;
    newClient.client_id = '213';
    clients.push(newClient);
    res.send(201, newClient);
    return next();
  });

  server.post('/api/taxreturn', (req, res, next) => {
    const newReturn = req.params;
    newReturn.return_id = '3124';
    returns.push(newReturn);
    res.send(201, newReturn);
    return next();
  });
};


/**
 * SERVER
 */
const port = process.env.PORT || 3000;
const server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

router(server);

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
