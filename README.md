# Donate App Backend

Backend of [Android app](https://github.com/sushi97/DonATE_Final) that reimagines the way of donating food by connecting the donor and receiver in a requirement/available pattern. The backend is written in NodeJS with 2FA authentication and automatic mailing.

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

See the [test.http](test.http) file for the updated API. Following is obselete.
Run the http requests using postman extention in chrome or rest extention in vs code editor with the [test.http](test.http) to get an example of response.

## Debugging Tips

If any response recived as Bad Request the check the "content-type" : "Application/json" header in your request.
