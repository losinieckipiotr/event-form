import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { validate } from 'email-validator';
import express from 'express';
import path from 'path';

// import { insertOne } from './data';
import { insertOne } from './data2';

const result = config();

if (result.error) {
  throw result.error
}

console.log('Config:', result.parsed);

const app = express();

// parse application/json
app.use(bodyParser.json())

// use in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));
}

function notEmpty(v: string) {
  return v !== ''
}

const isValidEmail = validate;

app.post('/api/postForm', function (req, res) {
  console.log('request', req.body);

  const {
    firstName,
    lastName,
    email,
    date,
  } = req.body;

  const parsedDate = new Date(date);

  const valid = [
    notEmpty(firstName),
    notEmpty(lastName),
    isValidEmail(email),
    !Number.isNaN(parsedDate.getTime()),
  ].reduce((p, c) => p && c);

  if (valid) {
    insertOne(firstName, lastName, email, parsedDate)
    .then(() => {
      res.contentType('application/json');
      res.send(JSON.stringify({result: "OK" }));
    })
    .catch((error: any) => {
      console.error(error);
      res.contentType('application/json');
      res.send(JSON.stringify({result: "ERROR"}));
    });
  } else {
    console.error('Invalid request');
    res.contentType('application/json');
    res.send(JSON.stringify({result: "ERROR"}));
  }
});

const port = Number(process.env.SERVER_PORT);

if (isNaN(port)) {
  throw new Error('Invalid SERVER_PORT');
}

app.listen(port);

console.log('Server is up, listening on port %s', port);
