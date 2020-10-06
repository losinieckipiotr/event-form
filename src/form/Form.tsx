import React, { useEffect, useState } from "react";
import email from "email-validator";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function notEmpty(v: string): boolean {
  return v !== ''
}

const  isValidEmail = email.validate;

export default function Form() {
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ date, setDate ] = useState<Date | undefined>(undefined);
  const [ formValid, setFormValid ] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const s = JSON.stringify({ firstName, lastName, email, date, formValid });
    // console.log(s);

    setFirstName('');
    setLastName('');
    setEmail('');
    setDate(undefined);
  }

  useEffect(() => {
    const valid = [
      notEmpty(firstName),
      notEmpty(lastName),
      isValidEmail(email),
      date !== undefined
    ].reduce((p, c) => p && c);

    setFormValid(valid);

    // console.log({
    //   firstName,
    //   lastName,
    //   email,
    //   date,
    //   formValid: valid,
    // });

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
