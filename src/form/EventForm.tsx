import email from 'email-validator';
import React from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-date-picker';
import { useAppDispatch } from '../app/store';
import {
  selectDate,
  selectEmail,
  selectFirstName,
  selectLastName,
  selectResult,
  setDate,
  setEmail,
  setFirstName,
  setLastName,
  setSuccess,
  setFailure,
} from './formSlice';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import postForm from '../api/postForm';

const isInvalidEmail = (v: string) => !email.validate(v);

export default function EventForm() {
  const firstName = useSelector(selectFirstName);
  const lastName = useSelector(selectLastName);
  const email = useSelector(selectEmail);
  const date = useSelector(selectDate);
  const result = useSelector(selectResult);
  const dispatch = useAppDispatch();

  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
  const onFirstNameChange = (e: InputChangeEvent) => dispatch(setFirstName(e.target.value));
  const onLastNameChange = (e: InputChangeEvent) => dispatch(setLastName(e.target.value));
  const onEmailChange = (e: InputChangeEvent) => dispatch(setEmail(e.target.value));
  const onDateChange = (d: Date | Date[] | null) => {
    if (d instanceof Date) {
      dispatch(setDate(d.toJSON()))
    } else {
      dispatch(setDate(''))
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // verify data
    if (firstName === '' ||
        lastName === '' ||
        isInvalidEmail(email) ||
        date === ''
    ) {
      // FIXME
      // client side verification, what is expected behaviour ?
      // dispatch(setMsg('Invalid values in form'));
      return;
    }

    postForm({
      firstName,
      lastName,
      email,
      date: new Date(date),
    })
    .then((response) => {
      if (response && response['result'] === 'OK') {
        dispatch(setSuccess());
      } else {
        console.error('Invalid response', response);
        dispatch(setFailure());
      }
    }).catch((error) => {
      console.error(error);
      dispatch(setFailure());
    });
  };

  return (
    <>
      <Container>
        <Row>
          <Col sm={2} xs={1}/>
          <Col sm={8} xs={10}>
            <Form onSubmit={onSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="group1">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      required
                      value={firstName}
                      onChange={onFirstNameChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="group2">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      required
                      value={lastName}
                      onChange={onLastNameChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="group3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  required
                  value={email}
                  onChange={onEmailChange}
                />
              </Form.Group>
              <Form.Label htmlFor="dateGroup">Date</Form.Label>
              <div className="mb-3">
                <DatePicker
                  required
                  onChange={onDateChange}
                  value={date === '' ? null : new Date(date)}
                />
              </div>
              <Button
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Col>
          <Col sm={2} xs={1}/>
        </Row>
      </Container>
      {result &&
        <div>{result}</div>
      }
    </>
  );
}
