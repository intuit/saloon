# saloon
## Persona-Based Test Seeding
[![Build Status](https://travis-ci.org/intuit/saloon.svg?branch=master)](https://travis-ci.org/intuit/saloon) [![GitHub release](https://img.shields.io/github/release/intuit/saloon.svg)](https://github.com/intuit/saloon/releases)

Seeding enterprise test data is hard :sob:. There are multiple database types, so you can't use a simple DB seeder. Then throw in parent/child resource relationships and microservices, and seeding an E2E account becomes near impossible to pull off and even harder to maintain.

_Saloon_ is a Javascript library that can be consumed via a test framework or run directly as a command line tool. The framework supplies two pieces to the engine: 1) __API "definitions"__, which tell the engine how and where to create each resource, and 2) __personas__, which are JSON schema trees showing parent/child relationships of all of an application's resources and params for each.

The engine then traverses through the persona, generating all required resources via XHR requests. The seeded data model is then returned to the console or test framework once complete :bowtie:.

# Usage
### Within test framework
- Import the library.
- Populate the definition registry
- Seed with a persona
```javascript
import { setDefinitions, seed } from 'saloon';
setDefinitions(anArrayOfDefinitions);

seed(homer_simpson)
  .then(output => { console.log(output) });

// OR

seed(homer_simpson, output => {
  console.log(output);
})
```

### Running the example
There is one example provided:
- A simple example backed by a local, mocked REST API.
```
npm install
npm run simple
```

# Definitions
Definitions tell the seeder information about each resource defined in the persona. Think of each definition as each one of your REST APIs.
- **method** (string|function) - HTTP method, defaults to "post"
- **endpoint** (string|function) _required_ - Resource URL
- **headers** (object|function) - All headers required for the request
- **body** (object|function) - Default request body, props can be overridden by the persona
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
- **id** (string) _required_ - Unique dentifier for the resource
- **type** (string) _required_ - Resource type, must have a definition with the same name
- **params** (object) - Request body
- **children** (array) - An array of children resources which will be seeded after the parent is finished.
- **childrenTemplate** (object) - A template for dynamically generating children.
- **childrenCount** (number) - The number of children to generate, using the template

```javascript
[
  {
    "id": "user-id",
    "type": "user",
    "params": {
      "username": "Homer_Simpson",
      "password": "DuffBeer1",
      "firstName": "Homer",
      "lastName": "Simpson"
    },
    "children": [
      {
        "id": "client-moe",
        "type": "client",
        "params": {
          "firstName": "Moe",
          "lastName": "Szyslak",
          "ssn": "123-"
        }
      }
    ]
  }
]
```

### Templates
As noted above, templates can be used via `childrenTemplate` and `childrenCount` to dynamically generate children resources. The `id` must remain unique, so it's suggested to use a random number or guid (see expression functions below).
```javascript
[
  {
    "id": "user-id",
    "type": "user",
    "childrenCount": "3",
    "childrenTemplate": {
      "id": "{{guid()}}",
      "type": "client",
      "children": [
        {
          "id": "{{guid()}}",
          "type": "taxreturn"
        },
        {
          "id": "{{guid()}}",
          "type": "taxreturn"
        }
      ]
    }
  }
]
```

### Expression Functions

There are number of expression functions available to dynamically generate test data, which can be called using double-braces.These functions are especially useful within `childrenTemplate` blocks. Here are all functions supported, with arguments and their defaults:
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
- `{{email(domain = null)}}`
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
