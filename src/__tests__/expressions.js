import test from 'ava';
import sinon from 'sinon';
import { recurseObjects } from '../expressions';
import * as expressionFunctions from '../expressionFunctions';

test('can handle non-existent expression functions', (t) => {
  const result = recurseObjects({
    foo: '{{bar()}}',
  });
  t.true(result.foo === '{{bar()}}');
});

test('can handle multiple arguments sent to expression functions', (t) => {
  sinon.stub(expressionFunctions, 'phone');
  recurseObjects({
    foo: '{{phone(true, \'us\')}}',
  });
  t.true(expressionFunctions.phone.called);

  const args = expressionFunctions.phone.getCall(0).args; //eslint-disable-line 
  t.true(args[0] === 'true');
  t.true(args[1] === 'us');
});
