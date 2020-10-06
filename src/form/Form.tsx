import React, { useEffect, useState } from "react";
import email from "email-validator";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function notEmpty(v: string): boolean {
  return v !== ''
}

const  isValidEmail = email.validate;

interface FormData {
  firstName: string,
  lastName: string;
  email: string;
  date: Date;
}

function postForm(data: FormData) {
  return fetch('/api/postForm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json());
}

export default function Form() {
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ date, setDate ] = useState<Date | undefined>(undefined);
  const [ formValid, setFormValid ] = useState(false);

  // function resetForm() {
  //   setFirstName('');
  //   setLastName('');
  //   setEmail('');
  //   setDate(undefined);
  // }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formValid === false || date === undefined) {
      return;
    }

    const data: FormData = { firstName, lastName, email, date };

    postForm(data)
    .then((response) => {
      console.log({response});
    });
  }

  useEffect(() => {
    const valid = [
      notEmpty(firstName),
      notEmpty(lastName),
      isValidEmail(email),
      date !== undefined
    ].reduce((p, c) => p && c);

    setFormValid(valid);

  }, [firstName, lastName, email, date]);

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>First name</label>
        <br/>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last name</label>
        <br/>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <br/>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Date</label>
        <br/>
        <DatePicker
          selected={date}
          onChange={(d: Date) => setDate(d)}
        />
      </div>
      <button disabled={!formValid} type="submit" >Submit</button>
    </form>
  );
}
