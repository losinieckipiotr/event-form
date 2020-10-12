import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';

import postForm, { FormData } from '../api/postForm';
import formReducer, { closeModal } from '../form/formSlice';
import EventForm from './EventForm';

jest.mock('../api/postForm', () => ({
  __esModule: true,
  default : jest.fn(),
}));

const postFormMock = postForm as jest.Mock<Promise<{[key: string]: string}>, [FormData]>;

afterEach(() => {
  postFormMock.mockClear();
});

/* TODO use Custom Render
 * examples:
 *   https://testing-library.com/docs/react-testing-library/setup#custom-render
 *   https://redux.js.org/recipes/writing-tests
 */
const renderEventFrom = () => {
  // configure new store like in store.ts
  // for each render to reset app state
  const store = configureStore({
    reducer: {
      form: formReducer,
    },
  });
  // render event form with store provider
  const { container, debug } = render(<Provider store={store}><EventForm/></Provider>);
  return { container, debug };
};

const testData = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan.kowalski@gmail.com',
};

const getTextInputs = () => {
  // type conversion for typescript, this should be tested
  const firstNameInput = screen.getByPlaceholderText('Enter first name') as HTMLInputElement;
  const lastNameInput = screen.getByPlaceholderText('Enter last name') as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText('Enter email') as HTMLInputElement;

  return {
    firstNameInput,
    lastNameInput,
    emailInput,
  };
};

const typeTestData = (
  firstNameInput: HTMLInputElement,
  lastNameInput: HTMLInputElement,
  emailInput: HTMLInputElement,
) => {

  return Promise.all([
    userEvent.type(firstNameInput, testData.firstName),
    userEvent.type(lastNameInput, testData.lastName),
    userEvent.type(emailInput, testData.email),
  ]);
};

// afterEach(() => {
//   console.log('cleanup');
//   cleanup();
// });

it('Event form inputs', async () => {
  renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  expect(firstNameInput).toBeInstanceOf(HTMLInputElement);
  expect(lastNameInput).toBeInstanceOf(HTMLInputElement);
  expect(emailInput).toBeInstanceOf(HTMLInputElement);

  expect(firstNameInput.value).toBe('');
  expect(lastNameInput.value).toBe('');
  expect(emailInput.value).toBe('');

  await typeTestData(firstNameInput, lastNameInput, emailInput);

  expect(firstNameInput.value).toBe(testData.firstName);
  expect(lastNameInput.value).toBe(testData.lastName);
  expect(emailInput.value).toBe(testData.email);
});

const now = new Date();
const today = {
  day: String(now.getDate()),
  month: String(now.getMonth() + 1),
  year: String(now.getFullYear()),
};

const getDateInputs = (container: HTMLElement) => {
  // type conversion for typescript, this should be tested
  const dayInput = container.querySelector('.react-date-picker__inputGroup__day') as HTMLInputElement;
  const monthInput = container.querySelector('.react-date-picker__inputGroup__month') as HTMLInputElement;
  const yearInput = container.querySelector('.react-date-picker__inputGroup__year') as HTMLInputElement;

  return {
    dayInput,
    monthInput,
    yearInput,
  };
};

it('Date picker - use mouse', async () => {
  const { container }  = renderEventFrom();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

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

const testDate = {
  day: '2',
  month: '10',
  year: '2020',
};

const testDateObj = new Date();
testDateObj.setMilliseconds(0);
testDateObj.setSeconds(0);
testDateObj.setMinutes(0);
testDateObj.setHours(0);
testDateObj.setDate(Number(testDate.day));
testDateObj.setMonth(Number(testDate.month) - 1);
testDateObj.setFullYear(Number(testDate.year));

const setTestDate = (
  dayInput: HTMLInputElement,
  monthInput: HTMLInputElement,
  yearInput: HTMLInputElement,
) => {
  fireEvent.change(dayInput, { target: { value: testDate.day }});
  fireEvent.change(monthInput, { target: { value: testDate.month }});
  fireEvent.change(yearInput, { target: { value: testDate.year }});
};

it('Date picker - use keyboard', async () => {
  const { container }  = renderEventFrom();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  setTestDate(dayInput, monthInput, yearInput);

  expect(dayInput.value).toBe(testDate.day);
  expect(monthInput.value).toBe(testDate.month);
  expect(yearInput.value).toBe(testDate.year);
});

it('success post', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  await typeTestData(firstNameInput, lastNameInput, emailInput);

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  setTestDate(dayInput, monthInput, yearInput);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;
  expect(submitButton).toBeInstanceOf(HTMLButtonElement);

  const resultOk = { 'result': 'OK' };
  postFormMock.mockResolvedValue(resultOk);

  fireEvent.click(submitButton);

  await expect(postFormMock).toHaveBeenCalledTimes(1);

  const data: FormData = {
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@gmail.com',
    date: testDateObj,
  };
  expect(postFormMock).toHaveBeenCalledWith(data);

  await waitFor(() => expect(screen.getByText('Form saved successfully')).toBeInTheDocument());

  const closeModalButton = screen.getByText('Close') as HTMLButtonElement;
  expect(closeModalButton).toBeInstanceOf(HTMLButtonElement);
  fireEvent.click(closeModalButton);

  expect(firstNameInput.value).toBe('');
  expect(lastNameInput.value).toBe('');
  expect(emailInput.value).toBe('');

  expect(dayInput.value).toBe('');
  expect(monthInput.value).toBe('');
  expect(yearInput.value).toBe('');
});

it('failure post - invalid response', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  await typeTestData(firstNameInput, lastNameInput, emailInput);
  setTestDate(dayInput, monthInput, yearInput);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  const resultOk = { 'result': 'ERROR' };
  postFormMock.mockResolvedValue(resultOk);

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(screen.getByText('There was an error, sorry')).toBeInTheDocument());

  const closeModalButton = screen.getByText('Close') as HTMLButtonElement;
  expect(closeModalButton).toBeInstanceOf(HTMLButtonElement);
  fireEvent.click(closeModalButton);

  // do not clear, user may try send form again
  expect(firstNameInput.value).toBe(testData.firstName);
  expect(lastNameInput.value).toBe(testData.lastName);
  expect(emailInput.value).toBe(testData.email);

  expect(dayInput.value).toBe(testDate.day);
  expect(monthInput.value).toBe(testDate.month);
  expect(yearInput.value).toBe(testDate.year);
});

it('failure post - rejcted', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  await typeTestData(firstNameInput, lastNameInput, emailInput);
  setTestDate(dayInput, monthInput, yearInput);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  postFormMock.mockRejectedValue(new Error('Test error'));

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(1);

  return waitFor(() => {
    return expect(screen.getByText('There was an error, sorry')).toBeInTheDocument();
  });
});


it('missing first name - post should not be called', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  await userEvent.type(lastNameInput, testData.lastName);
  await userEvent.type(emailInput, testData.email);

  setTestDate(dayInput, monthInput, yearInput);

  expect(firstNameInput.value).toBe('');

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);
});

it('missing last name - post should not be called', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  await userEvent.type(firstNameInput, testData.firstName);
  await userEvent.type(emailInput, testData.email);
  setTestDate(dayInput, monthInput, yearInput);

  expect(lastNameInput.value).toBe('');

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);
});

it('missing email - post should not be called', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  await userEvent.type(firstNameInput, testData.firstName);
  await userEvent.type(lastNameInput, testData.lastName);
  setTestDate(dayInput, monthInput, yearInput);

  const postFormMock = postForm as jest.Mock<Promise<{[key: string]: string}>, [FormData]>;

  expect(emailInput.value).toBe('');

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);
});

it('missing day - post should not be called', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  await typeTestData(firstNameInput, lastNameInput, emailInput);
  fireEvent.change(monthInput, { target: { value: testDate.month }});
  fireEvent.change(yearInput, { target: { value: testDate.year }});

  expect(dayInput.value).toBe('');

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);
});

it('missing month - post should not be called', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  await typeTestData(firstNameInput, lastNameInput, emailInput);
  fireEvent.change(dayInput, { target: { value: testDate.day }});
  fireEvent.change(yearInput, { target: { value: testDate.year }});

  expect(monthInput.value).toBe('');

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);
});

it('missing year - post should not be called', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;

  await typeTestData(firstNameInput, lastNameInput, emailInput);
  fireEvent.change(dayInput, { target: { value: testDate.day }});
  fireEvent.change(monthInput, { target: { value: testDate.month }});

  expect(yearInput.value).toBe('');

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);
});

it('invalid email address - post should not be called', async () => {
  const { container }  = renderEventFrom();

  const {
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getTextInputs();

  const {
    dayInput,
    monthInput,
    yearInput,
  } = getDateInputs(container);

  const submitButton = screen.getByText('Submit') as HTMLButtonElement;
  const invalidEmail1 = 'Abc.example.com';

  await userEvent.type(firstNameInput, testData.firstName);
  await userEvent.type(lastNameInput, testData.lastName);
  await userEvent.type(emailInput, invalidEmail1);
  setTestDate(dayInput, monthInput, yearInput);

  expect(emailInput.value).toBe(invalidEmail1);

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);

  const invalidEmail2 = 'A@b@c@example.com';

  await userEvent.type(emailInput, invalidEmail2);
  expect(emailInput.value).toBe(invalidEmail2);

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);

  const invalEmail3 = `this is"not\allowed@example.com`;

  await userEvent.type(emailInput, invalEmail3);
  expect(emailInput.value).toBe(invalEmail3);

  fireEvent.click(submitButton);

  expect(postFormMock).toHaveBeenCalledTimes(0);
});
