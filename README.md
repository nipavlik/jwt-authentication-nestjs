<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

This project using <b>access</b> and <b>refresh</b> tokens. <b>Sqlite3</b> is used to store users and refresh tokens, but you can use other databases.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints
```bash
/auth/login - login:admin password:admin

/auth/refresh - to update tokens

/users - list of users

/public - public page

/private - private page
```

## Variable environment
```bash
JWT_SECRET=secret - jwt secret key

JWT_ACCESS_EXPIRESIN=15m - lifetime of the access key

JWT_REFRESH_EXPIRESIN=1h - lifetime of the refresh key
```