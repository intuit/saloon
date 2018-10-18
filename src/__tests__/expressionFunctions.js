import test from 'ava';
import * as expFns from '../expressionFunctions';

test('address', (t) => {
  t.true(typeof expFns.address() === 'string');
});

test('age', (t) => {
  t.true(typeof expFns.age() === 'number');
});

test('bool', (t) => {
  t.true(typeof expFns.bool() === 'boolean');
});

test('country', (t) => {
  t.true(expFns.country().length === 2); // US
  t.true(expFns.country(true).length > 2); // United States of America
});

test('ccNum', (t) => {
  const num = expFns.ccNum();
  t.true(num.length >= 14 && num.length <= 16);
});

test('ccExpDate', (t) => {
  t.true(expFns.ccExpDate().length === 7); // 12/2019
});

test('company', (t) => {
  t.true(typeof expFns.company() === 'string');
});

test('date', (t) => {
  t.true(typeof expFns.date() === 'string'); // 12/12/2018
  t.true(typeof expFns.date(true, false) === 'object'); // JS Date Object
});

test('dollars', (t) => {
  t.true(expFns.dollars().substr(0, 1) === '$');
});

test('domain', (t) => {
  t.true(typeof expFns.domain() === 'string');
  t.true(expFns.domain().indexOf('.') !== -1);
});

test('ein', (t) => {
  t.true(expFns.ein().length === 10);
  t.true(expFns.ein().substr(2, 1) === '-');
});

test('email', (t) => {
  t.true(expFns.email().indexOf('@') !== -1);
  t.true(expFns.email().indexOf('.') !== -1);
  t.true(expFns.email('intuit.com').indexOf('@intuit.com') !== -1);
  t.true(expFns.email('intuit.com', true).indexOf('_') !== -1);
  t.true(expFns.email('intuit.com', true).indexOf('@intuit.com') !== -1);
});

test('gender', (t) => {
  const gender = expFns.gender();
  t.true(gender === 'Male' || gender === 'Female');
});

test('guid', (t) => {
  t.true(expFns.guid().length === 36);
});

test('firstName', (t) => {
  t.true(typeof expFns.firstName() === 'string');
});

test('integer', (t) => {
  t.true(typeof expFns.integer() === 'number');
});

test('fullName', (t) => {
  t.true(typeof expFns.fullName() === 'string');
});

test('lastName', (t) => {
  t.true(typeof expFns.lastName() === 'string');
});

test('paragraph', (t) => {
  t.true(typeof expFns.paragraph() === 'string');
});

test('phone', (t) => {
  t.true(typeof expFns.phone() === 'string');
});

test('profession', (t) => {
  t.true(typeof expFns.profession() === 'string');
});

test('ssn', (t) => {
  t.true(expFns.ssn().length === 11);
  t.true(expFns.ssn(false).length === 9);
});

test('ssnLastFour', (t) => {
  t.true(expFns.ssnLastFour().length === 4);
});

test('state', (t) => {
  t.true(expFns.state().length === 2);
  t.true(expFns.state(true).length > 2);
});

test('url', (t) => {
  t.true(expFns.url().indexOf('.') !== -1);
});

test('year', (t) => {
  t.true(expFns.year().length === 4);
});
