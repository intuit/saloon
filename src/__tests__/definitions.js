import test from 'ava';
import DefinitionRegistry from '../definitions';

let registry;
test.beforeEach(() => {
  registry = new DefinitionRegistry();
  registry.set([
    { type: 'foo' },
    { type: 'bar' },
  ]);
});

test('should allow adding a single definition to an existing registry', (t) => {
  registry.set({ type: 'baz' });
  t.true(registry._definitions.length === 3);
});

test('can handle references to non-existing definitions', (t) => {
  t.falsy(registry.get({ type: 'qux' }));
});

test('supports clearing the registry', (t) => {
  registry.clear();
  t.true(registry._definitions.length === 0);
});
