# saloon
## Persona-Based Test Seeding
[![Build Status](https://travis-ci.org/intuit/saloon.svg?branch=master)](https://travis-ci.org/intuit/saloon) [![GitHub release](https://img.shields.io/github/release/intuit/saloon.svg)](https://github.com/intuit/saloon/releases)

### Are you:
1. Tired of manually maintaining test data?
2. Wishing you could reuse seeding logic across projects and test suites?
3. Needing to speed up and add stability test data generation?
4. Wanting to build a GUI for generating accounts?

### Yeah?! Saloon is the one-stop shop!


# What is Saloon?
_Saloon_ is a Javascript library that can generate e2e accounts with enterprise data in mind. All you have to supply is a __persona__ and each of its entity __definitions__..._Saloon_ will handle the rest.

_Saloon_ works by traversing the persona and asynchronously generating each entity resource according to the entity definition's instructions. Simple! :bowtie:

Other cool stuff:
- Works with REST _and_ GraphQL
- Each entity has access to seeded parent data for simple retrieval of id's, auth tokens, etc
- Expression engine for generating random data
- Template engine for generating large data sets
- Automatic retries on failed requests

# Usage
- Import the library.
- Populate the definition registry
- Seed with a persona

```javascript
import saloon from 'saloon';

const definitions = [{
  type: 'restaurant',
  url: 'http://localhost:3000/api/restaurant'
}, {
  type: 'menu',
  url: 'http://localhost:3000/api/menu',
  body: data => ({ restaurantId: data.restaurantId })
}];

const persona = [{
  type: 'restaurant',
  params: {
    name: 'Bobs Burgers',
    owner: 'Bob Belcher',
    address: '123 Abc Rd, Long Island, NY'
  },
  children: [{
    type: 'menu',
    params: {
      name: 'Lunch Menu',
      startTime: '11:00',
      endTime: '14:00'
    }
  }, {
    type: 'menu',
    params: {
      name: 'Dinner Menu',
      startTime: '17:00',
      endTime: '23:00'
    }
  }]
}];

saloon.setDefinitions(definitions);
saloon.seed(persona)
  .then(output => {});
```
The example above will first seed the `restaurant` entity, followed by concurrently seeding both lunch and dinner `menu` entities.

### Running the examples
There are two examples provided:
```
yarn install
yarn run example // A simple example backed by a local, mocked REST API.
yarn run example:graphql // A more complex example involving both REST and GraphQL API's.
```


# Definitions
Definitions tell the seeder information about each resource defined in the persona. Think of each definition as each one of your REST APIs.
- **method** (string|function) - HTTP method, defaults to "post"
- **endpoint** (string|function) _required_ - Resource URL
- **headers** (object|function) - All headers required for the request
- **body** (object|function) - Default request body, props can be overridden by the persona (_REST ONLY_)
- **query** (string|function) - GraphQL query string (_GRAPHQL ONLY_)
- **variables** (object|function) - Default GraphQL query/mutation variables (_GRAPHQL ONLY_)
- **throttle** (number|function) - Throttle requests for this definition (some services can't handle concurrent requests)
```javascript
export default {
  method: 'put', // {string|function} HTTP method for generating resource, defaults to "post".
  endpoint: 'http://localhost:3000/api/user', // {string|function} Resource API endpoint.
  headers: {},
  body: {},
  throttle: 100
};
```
All definition values can also be functions. This is useful when the endpoint, headers, or body require values from parent resources. The functions will receive a `data` argument with all parent resource data:
- data (Object) - A flattened object with all previously seeded data.
```javascript
export default {
  endpoint: data => `http://localhost:3000/api/user/${data.user.user_id}/return`,
  headers: data => {
    return {
      Authorization: `firmid=${data.firm.firm_id}`
    }
  }
};
```

# Personas
A test suite will have a collection of personas to test different scenarios and use cases. Persona data is modeled as parent-child relationships.
- **type** (string) _required_ - Resource type, must have a definition with the same name
- **params** (object|string) - Request body _OR_ GraphQL variables
- **children** (array) - An array of children resources which will be seeded after the parent is finished.
- **childrenTemplate** (object) - A template for dynamically generating children.
- **childrenCount** (number) - The number of children to generate, using the template

```javascript
[
  {
    "type": "user",
    "params": {
      "username": "Homer_Simpson",
      "password": "DuffBeer1",
      "firstName": "Homer",
      "lastName": "Simpson"
    },
    "children": [
      {
        "type": "client"
      }
    ]
  }
]
```

### Templates
As noted above, templates can be used via `childrenTemplate` and `childrenCount` to dynamically generate children resources.
```javascript
[
  {
    "type": "user",
    "childrenCount": "3",
    "childrenTemplate": {
      "type": "client",
      "children": [
        {
          "type": "taxreturn"
        },
        {
          "type": "taxreturn"
        }
      ]
    }
  }
]
```

### Expression Functions

There are number of expression functions available to dynamically generate test data, which can be called using double-braces. _Expression functions are only available for REST entities_. These functions are especially useful within `childrenTemplate` blocks. Here are all functions supported, with arguments and their defaults.:
- `{{address()}}`
- `{{age()}}`
- `{{bool()}}`
- `{{ccExpDate()}}`
- `{{ccNum(type = null)}}`
- `{{company()}}`
- `{{country(full = false)}}`
- `{{date(american = true, string = true)}}`
- `{{dollars(max = 999999999)}}`
- `{{domain()}}`
- `{{ein()}}`
- `{{email(domain = null, timestamp = false)}}`
- `{{firstName()}}`
- `{{fullName()}}`
- `{{gender()}}`
- `{{guid(version = 4)}}`
- `{{integer(min = -999999999, max = 999999999)}}`
- `{{lastName()}}`
- `{{paragraph(sentences = 4)}}`
- `{{phone(country = 'us', dashes = true)}}`
- `{{profession()}}`
- `{{ssn(formatted = true)}}`
- `{{ssnLastFour()}}`
- `{{state(full = false, country = 'us')}}`
- `{{url()}}`
- `{{year(min = 1900, max = 2100)}}`
