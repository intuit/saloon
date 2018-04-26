import test from 'ava';
import server from '../../server';
import { seed, setDefinitions, setLoggingLevel } from '../main';
import definitions from '../../examples/simple/definitions';
import { homer_simpson, bart_simpson } from '../../examples/simple/personas';

/**
 * These are functional tests run against a local, mocked REST api.
 */

test.before(() => {
    setDefinitions(definitions);
    setLoggingLevel('info');
    return server.ready;
});

test.serial('output properties in the persona object persist based on the personas configuration', async t => {
    await seed(homer_simpson).then(output => {
        const outputFirstName = output.firstName;
        const personaFirstName = homer_simpson[0].params.firstName;
        t.is(outputFirstName, personaFirstName);
    });
});

test.serial('nested output properties in the persona object persist based on the personas configuration', async t => {
    await seed(homer_simpson).then(output => {
        const outputAddress = output.firmAddress1;
        const personaAddress = homer_simpson[0].children[0].params.firmAddress1;
        t.is(outputAddress, personaAddress);
    });
});

test.serial('properties { firm_id: 321 } from, the server response get merged in with the response', async t => {
    await seed(homer_simpson).then(output => {
        const outputFirmId = output.firm_id;
        t.is(outputFirmId, '321');
    });
});

test.serial('snapshot!', async t => {
    await seed(homer_simpson).then(output => {
        t.snapshot(output);
    });
});

test.serial('should expand templates', async t => {
    await seed(bart_simpson).then(output => {
        const emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;

        // Since random data is generated, we're just checking valid email/ssn for each one.
        t.true(emailRegex.test(output.renamedEmail0));
        t.true(emailRegex.test(output.renamedEmail1));
        t.true(emailRegex.test(output.renamedEmail2));
        t.true(ssnRegex.test(output.renamedSsn0));
        t.true(ssnRegex.test(output.renamedSsn1));
        t.true(ssnRegex.test(output.renamedSsn2));
    });
});

test.serial('should add model prefixes to nested child output', async t => {
    await seed(bart_simpson).then(output => {
        t.true(output['client0.renamedReturnName'] === 'Some 1040');
        t.true(output['client1.renamedReturnName'] === 'Some 1040');
        t.true(output['client2.renamedReturnName'] === 'Some 1040');
        t.true(output['client0.returnName'] === 'Some 1120');
        t.true(output['client1.returnName'] === 'Some 1120');
        t.true(output['client2.returnName'] === 'Some 1120');
    });
});

test.serial('should not create more rows than specified', async t => {
    await seed(bart_simpson).then(output => {
        t.falsy(output.renamedEmail3);
        t.falsy(output.renamedSsn3);
    });
});