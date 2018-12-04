import test from 'ava';
import server from '../../server';
import { seed, setDefinitions } from '../main';
import simpleDefinitions from '../../examples/standard/definitions';
import graphqlDefinitions from '../../examples/graphql/definitions';
import { homerSimpson, bartSimpson, montgomeryBurns } from '../../examples/standard/personas';
import { bobBelcher } from '../../examples/graphql/personas';

const definitions = simpleDefinitions.concat(graphqlDefinitions);

/**
 * These are functional tests run against a local, mocked REST api.
 */

test.before(() => {
  setDefinitions(definitions);
  return server.ready;
});

test.serial('output properties in the persona object persist based on the personas configuration', async (t) => {
  await seed(homerSimpson).then((output) => {
    const outputFirstName = output.user[0].firstName;
    const personaFirstName = homerSimpson[0].params.firstName;
    t.is(outputFirstName, personaFirstName);
  });
});

test.serial('nested output properties in the persona object persist based on the personas configuration', async (t) => {
  await seed(homerSimpson).then((output) => {
    const outputAddress = output.user[0].firm[0].firmAddress1;
    const personaAddress = homerSimpson[0].children[0].params.firmAddress1;
    t.is(outputAddress, personaAddress);
  });
});

test.serial('properties { firm_id: 321 } from, the server response get merged in with the response', async (t) => {
  await seed(homerSimpson).then((output) => {
    const outputFirmId = output.user[0].firm[0].firm_id;
    t.is(outputFirmId, '321');
  });
});

test.serial('snapshot!', async (t) => {
  await seed(homerSimpson).then((output) => {
    t.snapshot(output);
  });
});

test.serial('should expand templates', async (t) => {
  await seed(bartSimpson).then((output) => {
    const emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
    // Since random data is generated, we're just checking valid email/ssn for each one.
    t.true(emailRegex.test(output.user[0].firm[0].client[0].email));
    t.true(emailRegex.test(output.user[0].firm[0].client[1].email));
    t.true(emailRegex.test(output.user[0].firm[0].client[2].email));
    t.true(ssnRegex.test(output.user[0].firm[0].client[0].ssn));
    t.true(ssnRegex.test(output.user[0].firm[0].client[1].ssn));
    t.true(ssnRegex.test(output.user[0].firm[0].client[2].ssn));
  });
});

test.serial('should expand nested children in templates', async (t) => {
  await seed(bartSimpson).then((output) => {
    t.true(output.user[0].firm[0].client[0].taxreturn[0].returnName === 'Some 1040');
    t.true(output.user[0].firm[0].client[1].taxreturn[0].returnName === 'Some 1040');
    t.true(output.user[0].firm[0].client[2].taxreturn[0].returnName === 'Some 1040');
    t.true(output.user[0].firm[0].client[0].taxreturn[1].returnName === 'Some 1120');
    t.true(output.user[0].firm[0].client[1].taxreturn[1].returnName === 'Some 1120');
    t.true(output.user[0].firm[0].client[2].taxreturn[1].returnName === 'Some 1120');
  });
});

test.serial('should not create more rows than specified', async (t) => {
  await seed(bartSimpson).then((output) => {
    t.falsy(output.user[0].firm[0].client[3]);
    t.falsy(output.user[0].firm[0].client[0].taxreturn[2]);
  });
});

test.serial('should attempt 3 retries should the requests fail', async (t) => {
  await seed(montgomeryBurns).then((output) => {
    t.true(output.user[0].firstName === 'Montgomery');
  });
});

test.serial('should support graphql', async (t) => {
  await seed(bobBelcher).then((output) => {
    t.snapshot(output);
  });
});
