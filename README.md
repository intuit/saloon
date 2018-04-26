# saloon
Seeding real-life test data can be very complicated. There are typically a number of services, some that can run concurrently and some that have dependencies on others.

Saloon is a Javascript library that can either be consumed by a test framework or run directly as a command line tool. The framework supplies two pieces to the engine: 1) __API "definitions"__, which tell the engine how and where to create each resource, and 2) __personas__, which are JSON schema trees showing parent/child relationships of all of an application's resources and test data for each resource.

The engine then recurses through the persona, generating all required resources via XHR requests. Once all test data is generated, the callback supplied by the framework is called with any test variables requested in the persona. Those test variables are typically things like username/password combinations, client ids, etc

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
```

### Running the example
There is one example provided:
- A simple example backed by a local REST API.
```
npm install
npm run simple
```

# Definitions
Definitions tell the seeder information about each resource defined in the persona. There are currently five properties for each resource definition:
```javascript
export default {
  method: 'put', // {string|function} HTTP method for generating resource, defaults to "post".
  endpoint: 'http://localhost:3000/api/user', // {string|function} Resource API endpoint.
  headers: {}, // {Object|function} Any additional headers required for the request.
  body: {}, // {Object|function} Default request body.
  throttle: 100 // {number|function} Throttle requests of this definition (some services can't handle concurrent requests).
};
```
All definition values can also be functions. This is useful when the endpoint, headers, or body require values from parent resources. The functions will receive a `data` argument with all parent resource data:
- data {Object} - A flattened object with all previously seeded data.
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
- **id** (string, required) - Unique dentifier for the resource
- **type** (string, required) - Resource type, must have a definition with the same name
- **params** (object) - Request body
- **output** (array|string) - Values to be returned to the client after seeding (things like username/password, client ids, etc)
  - Can contain a collection of key/value pairs, in which case the value is mapped to a different key in the final output. This is useful if you have an array of resources that you'd like to have output as `client1`, `client2`, etc.
  - When used alongside `childrenTemplate`, the index will be appended to each key.
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
    "output": ["username", "password"],
    "children": [
      {
        "id": "client-moe",
        "type": "client",
        "params": {
          "firstName": "Moe",
          "lastName": "Szyslak",
          "ssn": "123-"
        },
        "output": [{ "client1": "client" }]
      }
    ]
  }
]
```

### Templates
As noted above, templates can be used via `childrenTemplate` and `childrenCount` to dynamically generate children resources. The `id` must remain unique, so it's suggested to use a random number or guid (see expression functions below). It's also worth noting that __`output` within `childrenTemplate` blocks will be transformed to add indices and parent definition types__, so that each child doesn't overwrite its parent output. See in this example:
```javascript
[
  {
    "id": "user-id",
    "type": "user",
    "output": "user_id",
    "childrenCount": "3",
    "childrenTemplate": {
      "id": "{{guid()}}",
      "type": "client",
      "output": "client_id",
      "children": [
        {
          "id": "{{guid()}}",
          "type": "taxreturn",
          "output": {
            "indReturnId": "return_id"
          }
        },
        {
          "id": "{{guid()}}",
          "type": "taxreturn",
          "output": {
            "bizReturnId": "return_id"
          }
        }
      ]
    }
  }
]
```
The output would be mapped to:
```javascript
{
  "user_id": "seeded-user-id",
  "client_id0": "first-seeded-client-id",
  "client_id1": "second-seeded-client-id",
  "client_id2": "third-seeded-client-id",
  "client0.indReturnId": "first-client-ind-return-id",
  "client0.bizReturnId": "first-client-biz-return-id",
  "client1.indReturnId": "second-client-ind-return-id",
  "client1.bizReturnId": "second-client-biz-return-id",
  "client2.indReturnId": "third-client-ind-return-id",
  "client2.bizReturnId": "third-client-biz-return-id",
}
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
