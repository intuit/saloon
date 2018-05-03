import test from 'ava';
import sinon from 'sinon';
import get from 'lodash.get';

import { expressionEvaluator } from '../expressions';
import * as expressionFunctions from '../expressionFunctions';


test('can handle non-existent expression functions', (t) => {
  const result = expressionEvaluator({
    foo: '{{bar()}}',
  });
  t.true(result.foo === '{{bar()}}');
});

test('can handle multiple arguments sent to expression functions', (t) => {
  sinon.stub(expressionFunctions, 'phone');
  expressionEvaluator({
    foo: '{{phone(true, \'us\')}}',
  });
  t.true(expressionFunctions.phone.called);

  const args = get(expressionFunctions, 'phone.getCall(0).args');
  t.true(args[0] === 'true');
  t.true(args[1] === 'us');
});
