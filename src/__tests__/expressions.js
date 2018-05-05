import test from 'ava';
import sinon from 'sinon';
import { recursePersonaParams } from '../expressions';
import * as expressionFunctions from '../expressionFunctions';

test('can handle non-existent expression functions', (t) => {
  const result = recursePersonaParams({
    foo: '{{bar()}}',
  });
  t.true(result.foo === '{{bar()}}');
});

test('can express nested expressions', (t) => {
  const result = recursePersonaParams({
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
  const result = recursePersonaParams({
    foo: '{{bool()}}',
    test: {
      bar: '{{bool()}}',
      foo: [{ bar: '{{bool()}}' }, { test: [{ supernested: '{{bool()}}' }] }],
    },
  });
  t.true(typeof result.test.foo[0].bar === 'boolean');
  t.true(typeof result.test.foo[1].test[0].supernested === 'boolean');
  t.true(typeof result.test.bar === 'boolean');
});

test('can handle multiple arguments sent to expression functions', (t) => {
  sinon.stub(expressionFunctions, 'phone');
  recursePersonaParams({
    foo: '{{phone(true, \'us\')}}',
  });
  t.true(expressionFunctions.phone.called);

  const args = expressionFunctions.phone.getCall(0).args; //eslint-disable-line 
  t.true(args[0] === 'true');
  t.true(args[1] === 'us');
});
