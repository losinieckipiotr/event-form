const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

console.log(process.env.NODE_ENV);

// parse application/json
app.use(bodyParser.json())

// app.use(express.static(path.join(__dirname, '..', 'build')));

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

app.post('/api/postForm', function (req, res) {
  console.log(req.body);
  res.send(JSON.stringify({result: "OK"}));
});

app.listen(9000);
