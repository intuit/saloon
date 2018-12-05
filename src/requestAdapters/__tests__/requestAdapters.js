import test from 'ava';
import requestAdapter from '../index';

test('should return an execute method', (t) => {
  t.true(typeof requestAdapter({}).execute === 'function');
});

test('should return a constructPayload method', (t) => {
  t.true(typeof requestAdapter({}).constructPayload === 'function');
});

