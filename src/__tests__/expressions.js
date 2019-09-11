import test from 'ava';
import sinon from 'sinon';
import { recursivelyParsePersonaParams } from '../expressions';
import * as expressionFunctions from '../expressionFunctions';

test('can handle non-existent expression functions', (t) => {
  const result = recursivelyParsePersonaParams({
    foo: '{{bar()}}',
  });
  t.true(result.foo === '{{bar()}}');
});

test('can express nested expressions', (t) => {
  const result = recursivelyParsePersonaParams({
    foo: '{{bool()}}',
    test: {
      bar: '{{bool()}}',
      foo: {
        bar: '{{bool()}}',
      },
    },
  });
  t.true(typeof result.test.foo.bar === 'boolean');
  t.true(typeof result.test.bar === 'boolean');
});

test('can express nested expressions in arrays', (t) => {
  const result = recursivelyParsePersonaParams({
    foo: '{{bool()}}',
    test: {
      bar: '{{bool()}}',
      foo: [{ bar: '{{bool()}}' }, { test: [{ supernested: '{{bool()}}' }] }],
    },
  });
  t.true(Array.isArray(result.test.foo));
  t.true(Array.isArray(result.test.foo[1].test));
  t.true(typeof result.test.foo[0].bar === 'boolean');
  t.true(typeof result.test.foo[1].test[0].supernested === 'boolean');
  t.true(typeof result.test.bar === 'boolean');
});

test('can handle multiple arguments sent to expression functions', (t) => {
  sinon.stub(expressionFunctions, 'phone');
  recursivelyParsePersonaParams({
    foo: '{{phone(true, \'us\')}}',
  });
  t.true(expressionFunctions.phone.called);

  const args = expressionFunctions.phone.getCall(0).args; //eslint-disable-line
  t.true(args[0] === true);
  t.true(args[1] === 'us');
});

test('can handle booleans passed in as strings to expression functions', (t) => {
  recursivelyParsePersonaParams({
    foo: '{{phone(\'true\')}}',
  });
  t.true(expressionFunctions.phone.called);

  const args = expressionFunctions.phone.getCall(0).args; //eslint-disable-line
  t.true(args[0] === true);
});

test('can handle graphql strings as params', (t) => {
  const input = 'I am a graphql query';
  const result = recursivelyParsePersonaParams(input);
  t.true(input === result);
});
