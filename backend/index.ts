import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import path from 'path';

import postFormHandler from './src/postFormHandler';

const result = config();
if (result.error) {
  throw result.error
}
const port = Number(process.env.SERVER_PORT);
if (isNaN(port)) {
  throw new Error('Invalid SERVER_PORT');
}
const dbUrl = process.env.DB_URL;
if (dbUrl === undefined) {
  throw new Error('Missing DB URL');
}

console.log('Config:', result.parsed);

const app = express();
app.use(bodyParser.json());// parse application/json
// use in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));
}
app.post('/api/postForm', (res, req) => postFormHandler(res, req, dbUrl));
app.listen(port);

console.log('Server is up, listening on port %s', port);
