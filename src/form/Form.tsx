import 'react-datepicker/dist/react-datepicker.css';

import email from 'email-validator';
import React from 'react';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../app/store';
import { setDate, setEmail, setFirstName, setLastName, setMsg } from './formSlice';

const isInvalidEmail = (v: string) => !email.validate(v);

interface ValidFormData {
  firstName: string,
  lastName: string;
  email: string;
  date: Date;
}

function postForm(data: ValidFormData) {
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
  const firstName = useSelector<RootState, string>((state) => state.form.firstName);
  const lastName = useSelector<RootState, string>((state) => state.form.lastName);
  const email = useSelector<RootState, string>((state) => state.form.email);
  const date = useSelector<RootState, string>((state) => state.form.date);
  const msg = useSelector<RootState, string>((state) => state.form.msg);
  const dispatch = useAppDispatch();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // verify data
    if (firstName === '' ||
        lastName === '' ||
        isInvalidEmail(email) ||
        date === ''
    ) {
      return;
    }

    postForm({
      firstName,
      lastName,
      email,
      date: new Date(date),
    })
    .then((response) => {
      console.log({response});
      dispatch(setMsg(JSON.stringify(response)));
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>First name</label>
        <br/>
        <input
          required
          type="text"
          value={firstName}
          onChange={(e) => dispatch(setFirstName(e.target.value))}
        />
        {/* <div>Please enter first name</div> */}
      </div>
      <div>
        <label>Last name</label>
        <br/>
        <input
          required
          type="text"
          value={lastName}
          onChange={(e) => dispatch(setLastName(e.target.value))}
        />
        {/* <div>Please enter last name</div> */}
      </div>
      <div>
        <label>Email</label>
        <br/>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
        />
        {/* <div>Plese enter email address</div> */}
      </div>
      <div>
        <label>Event date</label>
        <br/>
        <DatePicker
          required={true}
          selected={date === '' ? null : new Date(date)}
          onChange={(d: Date | null) => {
            if (d === null) {
              dispatch(setDate(''));
            } else {
              dispatch(setDate(d.toISOString()))
            }
          }}
        />
      </div>
      {/* <div>Plese enter event date</div> */}
      <button type="submit">Submit</button>
      {msg !== '' && <p>{msg}</p>}
    </form>
  );
}
