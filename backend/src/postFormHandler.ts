import { validate } from 'email-validator';
import { Request, Response } from 'express';
import insertOne from './insertOne';

function notEmptyString(v: any): boolean {
  return typeof v === 'string' && v !== '';
}

const isValidEmail = (v: any): boolean => {
  return typeof v === 'string' ? validate(v) : false;
};

export default function postFormHandler(req: Request, res: Response, dbUrl: string): Promise<void> {
  console.log('request', req.body);

  const {
    firstName,
    lastName,
    email,
    date,
    // note: additional values will be skipped
  } = req.body;
  const parsedDate = new Date(date);

  // TODO change this validation to custom moongose validator
  // https://mongoosejs.com/docs/validation.html#custom-validators
  const valid = [
    notEmptyString(firstName),
    notEmptyString(lastName),
    isValidEmail(email),
    !Number.isNaN(parsedDate.getTime()),
  ].reduce((p, c) => p && c);

  if (valid) {
    return insertOne({
      firstName: firstName,
      lastName: lastName,
      email: email,
      date: parsedDate,
    }, dbUrl)
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
    return Promise.resolve();
  }
}
