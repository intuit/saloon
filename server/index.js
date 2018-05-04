/* eslint-env node */

import restify from 'restify'; // eslint-disable-line import/no-extraneous-dependencies

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

    if (!users.find(user => user.user_id === newFirm.user_id)) {
      res.send(400, { error: 'User not found' });
      return next();
    }

    newFirm.firm_id = '321';
    firms.push(newFirm);

    res.send(201, newFirm);
    return next();
  });

  server.post('/api/client', (req, res, next) => {
    const newClient = req.params;

    if (!firms.find(firm => firm.firm_id === newClient.firm_id)) {
      res.send(400, { error: 'Firm not found' });
      return next();
    }

    newClient.client_id = '213';
    clients.push(newClient);

    res.send(201, newClient);
    return next();
  });

  server.post('/api/taxreturn', (req, res, next) => {
    const newReturn = req.params;

    if (!clients.find(client => client.client_id === newReturn.client_id)) {
      res.send(400, { error: 'Client not found' });
      return next();
    }

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
