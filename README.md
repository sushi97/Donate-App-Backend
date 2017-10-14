# Donate App Backend

Backend Express App for Donate project.

## Getting Started

In the project directory open terminal and type,

```bash
npm install
```

### Running the Server

In the project directory open terminal and type,

```bash
npm start
```

OR

```bash
nodemon
```

Then start your mongod server. The database path is specified in [config/database.js].
If faced connection problems try checking the path.

## REST Api

See the [text.http](text.http) file for the updated API. Following is obselete.
Run the http requests using postman extention in chrome or rest extention in vs code editor with the [text.http](text.http) to get an example of response.

### For registering user

Send a POST request, with header "content-type" set to "Application/json" and body:

```json
{
    "name":"Vikas",
    "email":"vikaskodag@gmail.com",
    "username":"GodKira",
    "password":"god123"
}
```

to <http://localhost:3000/users/register> and will get a response,

```json
{
    "success": true,
    "msg": "User registered"
}
```

which indicates successful registration.

### For Login/Authentication Token

Login/Authentication Token is required to access protected resources.
For acquirinq token Send a  POST request, with header "content-type" set to "Application/json" and body:

```json
{
    "username":"GodKira",
    "password":"god123"
}
````

to <http://localhost:3000/users/authenticate> which will generate a response:

```json
{
    "success": true,
    "token": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjU5ZDhhODFkZjE1ZTMwMzEyMzNlZTdmYiIsIm5hbWUiOiJWaWthcyIsImVtYWlsIjoidmlrYXNrb2RhZ0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkdvZEtpcmEiLCJwYXNzd29yZCI6IiQyYSQxMCRJazc0VDBNR1Z0VG1Ia3lLMEpWTjRlcloyUDFJYkNacDRSWVRhZnA2VE1iUThrNGRhdmNtbSIsIl9fdiI6MH0sImlhdCI6MTUwNzM3MTQ2NSwiZXhwIjoxNTA3OTc2MjY1fQ.eqU3bzFSzf9t8z0m4xFJ78eaPTCjRZnbxvbrGCANNak",
    "user": {
        "id": "59d8a81df15e3031233ee7fb",
        "name": "Vikas",
        "username": "GodKira",
        "email": "vikaskodag@gmail.com"
    }
}
```

Notice the field token which needs to be stored for future accessing of protected resources.

### For accessing profiles

To access profiles which is a protected resource,
send a GET request with "Authentication" header set to "TOKEN_ACQUIRED_FROM_LOGIN" to <http://localhost:3000/users/profile> which will generate a response:

```json
{
    "user": {
        "name": "Vikas",
        "username": "GodKira",
        "email": "vikaskodag@gmail.com"
    }
}
```

### For getting all Requests

TO get all the requests registered/avaliable,
send a GET request with "Authentication" header set to "TOKEN_ACQUIRED_FROM_LOGIN" to <http://localhost:3000/requests/> which will genrate a response:

```json
[
    {
        "_id": "59d897d54fb5f62a18c4e485",
        "userId": "59d7dd14ac08fc3159d91ba5",
        "type": "accept",
        "address": "Pune",
        "__v": 0,
        "quantity": {
            "noOfPersons": 3
        }
    },
    {
        "_id": "59d8988f649d2b2a975b7fe4",
        "userId": "59d7dd14ac08fc3159d91ba5",
        "type": "accept",
        "address": "Pune",
        "__v": 0,
        "quantity": {
            "noOfPersons": 3
        }
    }
]
```

### For posting a request

A request can be posted by a user as follows,
send a GET request with "Authentication" header set to "TOKEN_ACQUIRED_FROM_LOGIN" and "content-tyoe" header set to "Appliction/json" to <http://localhost:3000/requests/> with a body:

```json
{
    "type":"accept",
    "quantity":{
    "noOfPersons":"3"
    },
    "address":"Pune"
}
```

which will generate a response:

```json
{
    "success": true,
    "msg": "Request accepted",
    "id": "59d8af78a27e9c3325d20fff"
}
```

the id is the reqest id which wll be used for future refrencing.

## Debugging Tips

If any response recived as Bad Request the check the "content-type" : "Application/json" header in your request.