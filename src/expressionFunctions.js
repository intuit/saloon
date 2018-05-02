import Chance from 'chance';

const chance = new Chance();

function address() {
  return chance.address();
}

function age() {
  return chance.age();
}

function bool() {
  return chance.bool();
}

function country(full = false) {
  return chance.country({ full });
}

function ccNum(type = null) {
  return chance.cc({ type });
}

function ccExpDate() {
  return chance.exp();
}

function company() {
  return chance.company();
}

function date(american = true, string = true) {
  return chance.date({ american, string });
}

function dollars(max = 999999999) {
  return chance.dollar({ max });
}

function domain() {
  return chance.domain();
}

function ein() {
  return [...Array(10).keys()]
    .map((i) => {
      if (i < 2) return Math.floor(Math.random() * 9);
      if (i == 2) return '-';
      return Math.floor(Math.random() * 10);
    })
    .join('');
}

function email(domain = null) {
  return chance.email({ domain });
}

function gender() {
  return chance.gender();
}

function guid(version = 4) {
  return chance.guid({ version });
}

function firstName() {
  return chance.first();
}

function integer(min = -999999999, max = 999999999) {
  return chance.integer({ min, max });
}

function lastName() {
  return chance.last();
}

function fullName() {
  return chance.name();
}

function paragraph(sentences = 4) {
  return chance.paragraph({ sentences });
}

function phone(country = 'us', dashes = true) {
  return chance.phone({ country, dashes });
}

function profession() {
  return chance.profession();
}

function ssn(dashes = true) {
  return chance.ssn({ dashes });
}

function ssnLastFour() {
  return chance.ssn({ ssnFour: true });
}

function state(full = false, country = 'us') {
  return chance.state({ full, country });
}

function url() {
  return chance.url();
}

function year(min = 1900, max = 2100) {
  return chance.year({ min, max });
}

export {
  address,
  age,
  bool,
  ccExpDate,
  ccNum,
  company,
  country,
  date,
  dollars,
  domain,
  ein,
  email,
  firstName,
  fullName,
  gender,
  guid,
  integer,
  lastName,
  paragraph,
  phone,
  profession,
  ssn,
  ssnLastFour,
  state,
  url,
  year,
};
