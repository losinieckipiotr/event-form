import 'jest-canvas-mock';

import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, findByText  } from '@testing-library/react'
import store from '../app/store';
import { Provider } from 'react-redux';
import EventForm from './EventForm';
import userEvent from '@testing-library/user-event';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import postForm, { FormData} from '../api/postForm';

jest.mock('../api/postForm', () => ({
  __esModule: true, // this property makes it work
  default : jest.fn(),
}));

it('Event form inputs', async () => {
  //render event form
  render(<Provider store={store}><EventForm/></Provider>);

  // first name input should be rendered
  const firstNameInput = screen.getByPlaceholderText('Enter first name') as HTMLInputElement;
  const lastNameInput = screen.getByPlaceholderText('Enter last name') as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText('Enter email') as HTMLInputElement;

  expect(firstNameInput).toBeInstanceOf(HTMLInputElement);
  expect(lastNameInput).toBeInstanceOf(HTMLInputElement);
  expect(emailInput).toBeInstanceOf(HTMLInputElement);

  expect(firstNameInput.value).toBe('');
  expect(lastNameInput.value).toBe('');
  expect(emailInput.value).toBe('');

  await userEvent.type(firstNameInput, 'Jan');
  await userEvent.type(lastNameInput, 'Kowalski');
  await userEvent.type(emailInput, 'jan.kowalski@gmail.com');

  expect(firstNameInput.value).toBe('Jan');
  expect(lastNameInput.value).toBe('Kowalski');
  expect(emailInput.value).toBe('jan.kowalski@gmail.com');
});

it('Date picker, set today by mouse', async () => {
  const { container } = render(<Provider store={store}><EventForm/></Provider>);
  const now = new Date();
  const today = {
    day: String(now.getDate()),
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  };

  const dayInput = container.querySelector('.react-date-picker__inputGroup__day') as HTMLInputElement;
  const monthInput = container.querySelector('.react-date-picker__inputGroup__month') as HTMLInputElement;
  const yearInput = container.querySelector('.react-date-picker__inputGroup__year') as HTMLInputElement;

  expect(dayInput).toBeInstanceOf(HTMLInputElement);
  expect(monthInput).toBeInstanceOf(HTMLInputElement);
  expect(yearInput).toBeInstanceOf(HTMLInputElement);

  expect(dayInput.placeholder).toBe('--');
  expect(monthInput.placeholder).toBe('--');
  expect(yearInput.placeholder).toBe('----');

  expect(dayInput.value).toBe('');
  expect(monthInput.value).toBe('');
  expect(yearInput.value).toBe('');

  // get calendar element
  const calendar = container.querySelector('.react-date-picker') as HTMLDivElement;
  expect(calendar).toBeInstanceOf(HTMLDivElement);
  // calendar should be closed first
  expect(calendar.className).toContain('react-date-picker--closed');

  // get button to open calendar
  const calendarButton = container.querySelector('.react-date-picker__calendar-button') as HTMLButtonElement;
  expect(calendarButton).toBeInstanceOf(HTMLButtonElement);
  fireEvent.click(calendarButton);

  // calendar should be open
  expect(calendar.className).toContain('react-date-picker--open');

  // get button with current day
  const todayButton = container.querySelector('.react-calendar__tile--now') as HTMLButtonElement;
  expect(todayButton).toBeInstanceOf(HTMLButtonElement);
  const todayEl = todayButton.children[0] as HTMLElement;
  expect(todayEl).toBeInstanceOf(HTMLElement);

  expect(todayEl.textContent).toBe(today.day); // check if it renders current day
  fireEvent.click(todayButton); // click to set inputs

  expect(dayInput.value).toBe(today.day);
  expect(monthInput.value).toBe(today.month);
  expect(yearInput.value).toBe(today.year);

  const clearButton = container.querySelector('.react-date-picker__clear-button') as HTMLButtonElement;
  expect(clearButton).toBeInstanceOf(HTMLButtonElement);
  fireEvent.click(clearButton); // click to clear inputs

  expect(dayInput.value).toBe('');
  expect(monthInput.value).toBe('');
  expect(yearInput.value).toBe('');
});

it('Date picker, set day by keyboard', async () => {
  const { container } = render(<Provider store={store}><EventForm/></Provider>);

  const dayInput = container.querySelector('.react-date-picker__inputGroup__day') as HTMLInputElement;
  const monthInput = container.querySelector('.react-date-picker__inputGroup__month') as HTMLInputElement;
  const yearInput = container.querySelector('.react-date-picker__inputGroup__year') as HTMLInputElement;

  fireEvent.change(dayInput, { target: { value: '02' }});
  fireEvent.change(monthInput, { target: { value: '12' }});
  fireEvent.change(yearInput, { target: { value: '1993' }});

  expect(dayInput.value).toBe('2');
  expect(monthInput.value).toBe('12');
  expect(yearInput.value).toBe('1993');
});

it('success post test', async () => {
  //render event form
  const { container } = render(<Provider store={store}><EventForm/></Provider>);

  // first name input should be rendered
  const firstNameInput = screen.getByPlaceholderText('Enter first name') as HTMLInputElement;
  const lastNameInput = screen.getByPlaceholderText('Enter last name') as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText('Enter email') as HTMLInputElement;

  await Promise.all([
    userEvent.type(firstNameInput, 'Jan'),
    userEvent.type(lastNameInput, 'Kowalski'),
    userEvent.type(emailInput, 'jan.kowalski@gmail.com'),
  ]);

  const dayInput = container.querySelector('.react-date-picker__inputGroup__day') as HTMLInputElement;
  const monthInput = container.querySelector('.react-date-picker__inputGroup__month') as HTMLInputElement;
  const yearInput = container.querySelector('.react-date-picker__inputGroup__year') as HTMLInputElement;

  fireEvent.change(dayInput, { target: { value: '02' }});
  fireEvent.change(monthInput, { target: { value: '12' }});
  fireEvent.change(yearInput, { target: { value: '1993' }});

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;
  expect(submitButton).toBeInstanceOf(HTMLButtonElement);

  const postFormMock = postForm as jest.Mock<Promise<string>, [FormData]>;
  const resultOk = JSON.stringify({ result: 'OK' });
  postFormMock.mockResolvedValue(resultOk);

  fireEvent.click(submitButton);

  await expect(postFormMock).toHaveBeenCalledTimes(1);

  const d = new Date();
  d.setMilliseconds(0);
  d.setSeconds(0);
  d.setMinutes(0);
  d.setHours(0);
  d.setDate(2);
  d.setMonth(11);
  d.setFullYear(1993);
  const data: FormData = {
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@gmail.com',
    date: d,
  };

  expect(postFormMock).toHaveBeenCalledWith(data);
  expect(screen.getByText('SUCCESS')).toBeInTheDocument();

  // return waitFor(() => {
  //   return expect(screen.getByText('SUCCESS')).toBeInTheDocument();
  // });
});

