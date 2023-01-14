# Healthcare Management Service

## Description

Backend REST API service for healthcare management.

## Getting Started

### Prerequisites

- NodeJS/NPM
- PostgreSQL

### Dependencies

- NodeJS v19
- NestJS v9
- Postgres v8
- CognitoJS v6
- TypeORM v0.3

## Using this project

1. Clone the project, and in the root directory install the dependencies.

  ```bash
  $ git clone https://github.com/mattstuhring/healthcare-management-service.git
  $ npm install
  ```

2. In the root directory, create a ```.env.dev``` file for development configs by following ```.env.example```.
 
3. Start the server on PORT 3000.

  Get started in development mode:

  ```bash
  $ npm run start:dev
  ```

  For production mode use the following command. (Note: you will need to create a ```.env.prod``` file)

  ```bash
  $ npm run start:prod
  ```

## Testing

Testing the code use any of the following commands:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

To test the APIs use Postman.

TODO - Document API

## Authors

Contributors names and contact info can be found here.

Matt Stuhring
- LinkedIn - https://www.linkedin.com/in/mattstuhring/
- Github - https://github.com/mattstuhring

## Version History

- 0.1
  - Initial Release

## License

This project is licensed under the MIT License.
