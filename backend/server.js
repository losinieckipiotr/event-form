const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const { insertOne } = require('./data');
const isValidEmail = require("email-validator").validate;

// parse application/json
app.use(bodyParser.json())

// use in production
// app.use(express.static(path.join(__dirname, '..', 'build')));

// ?
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

function notEmpty(v) {
  return v !== ''
}

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
      res.send(JSON.stringify({result: "OK" }));
    })
    .catch((error) => {
      console.error(error);
      res.send(JSON.stringify({result: "ERROR"}));
    });
  } else {
    console.error('Invalid data');
    res.send(JSON.stringify({result: "INVALID DATA"}));
  }
});

app.listen(9000);
