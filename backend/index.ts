import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import path from 'path';

import postFormHandler from './src/postFormHandler';

const result = config();

if (result.error) {
  throw result.error
}

console.log('Config:', result.parsed);

const app = express();

// parse application/json
app.use(bodyParser.json());

// use in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));
}

app.post('/api/postForm', postFormHandler);

const port = Number(process.env.SERVER_PORT);

if (isNaN(port)) {
  throw new Error('Invalid SERVER_PORT');
}

app.listen(port);

console.log('Server is up, listening on port %s', port);
