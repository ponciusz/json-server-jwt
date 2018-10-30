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

{
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
    [
        {
            "id": 1,
            "name": "Product001",
            "cost": 10.0,
            "quantity": 1000,
            "locationId" : 1,
            "familyId" : 1
        },
        {
            "id": 2,
            "name": "Product002",
            "cost": 20.0,
            "quantity": 2000,
            "locationId" : 1,
            "familyId" : 2
        },   
        {
            "id": 3,
            "name": "Product003",
            "cost": 30.0,
            "quantity": 3000,
            "locationId" : 3,
            "familyId" : 2     
        },
        {
            "id": 4,
            "name": "Product004",
            "cost": 40.0,
            "quantity": 4000,
            "locationId" : 2,
            "familyId" : 3
        }
    ]
}
```