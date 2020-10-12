import { validate } from 'email-validator';
import { Request, Response } from 'express';
import { insertOne } from './data2';

function notEmpty(v: string) {
  return v !== ''
}

const isValidEmail = validate;

export default function postFormHandler(req: Request, res: Response) {
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
}
