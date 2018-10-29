# json-server-jwt

Fake REST based on https://github.com/typicode/json-server with some extra functionality like:

- JWT tokens
- JWT refresh token

Remember that refresh tokens are stored in memory every time you will restart app or do any changes when `nodemon` is running it will invalidate all refresh tokens.

## How to start


`git clone git@github.com:ponciusz/json-server-jwt.git`

`yarn install`

`yarn start`

## Get token

```
POST /auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "admin@email.com",
  "password":"admin"
}
```
Response:
```
{
    "accessToken": YOUR_TOKEN,
    "refreshToken": YOUR_REFRESH_TOKEN,
    "email": "admin@email.com"
}
```

## Refresh token
```
POST /auth/token HTTP/1.1
Host: localhost:3000
Authorization: Bearer YOUR_TOKEN

{
  "email": "admin@email.com",
  "password":"admin",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWRtaW4iLCJpYXQiOjE1NDA4MzA2NDQsImV4cCI6MTU0MDkxNzA0NH0.REaPgw8nRlYZIaMFZ0--9fn79-ba9NITHsC--bgbp1Q"
}
```
Response:
```
{
    "token": YOUR_REFRESHED_TOKEN
}
```

## Access resources
```
GET /products HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```
Response:
```
{
    "token": YOUR_REFRESHED_TOKEN
}
```