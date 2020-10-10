import express from 'express';
import  bodyParser from 'body-parser';
import { insertOne } from './data';
import { validate } from 'email-validator';

const app = express();

// parse application/json
app.use(bodyParser.json())

// use in production
// app.use(express.static(path.join(__dirname, '..', 'build')));

// ?
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

function notEmpty(v: string) {
  return v !== ''
}

const isValidEmail = validate;

app.post('/api/postForm', function (req, res) {
  console.log('recived');
  console.log(req.body);

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
    console.error('Invalid data');
    res.contentType('application/json');
    res.send(JSON.stringify({result: "INVALID DATA"}));
  }
});

const port = 9000;

app.listen(port);

console.log('Backend is up, listening on port %s', port);
