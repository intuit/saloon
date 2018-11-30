import test from 'ava';
import sinon from 'sinon';
import requestAdapter, { requestAdapters } from '../index';

test('should return an execute method', (t) => {
  t.true(typeof requestAdapter({}).execute === 'function');
});

test('should return the rest adapter by default', (t) => {
  sinon.stub(requestAdapters, 'rest');
  requestAdapter({}).execute();
  t.true(requestAdapters.rest.called);
});
