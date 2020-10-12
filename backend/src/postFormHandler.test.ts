import mongoose from 'mongoose';
import insertOne from './insertOne';
import postFormHandler from './postFormHandler';
import { EventFormData } from './EventFormModel';

jest.mock('./insertOne', () => ({
  __esModule: true,
  default : jest.fn(),
}));

const insertOneMock = insertOne as jest.Mock<Promise<void>, [EventFormData, string]>;

const MONGO_URL = process.env.MONGO_URL as string;

afterEach(() => {
  insertOneMock.mockClear();
});

afterAll(async () => {
  const db = mongoose.connection;
  await db.close();
});

// TODO refactoring
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

const testData = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan.kowalski@gmail.com',
  date: testDateObj,
};

it('valid request should send valid result', async () => {
  const requestMock = {
    body: {
      firstName: testData.firstName,
      lastName: testData.lastName,
      email: testData.email,
      date: testDateObj.toJSON(),
    }
  };
  const resMock = {
    contentType: jest.fn(),
    send: jest.fn(),
  };
  insertOneMock.mockResolvedValue();

  // @ts-ignore
  await postFormHandler(requestMock, resMock, MONGO_URL);

  expect(insertOneMock).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledWith('application/json');
  expect(resMock.send).toBeCalledTimes(1);
  expect(resMock.send).toBeCalledWith(JSON.stringify({result: "OK" }));
});

it('insertOne rejects (data base down) - should send error result', async () => {
  const requestMock = {
    body: {
      firstName: testData.firstName,
      lastName: testData.lastName,
      email: testData.email,
      date: testDateObj.toJSON(),
    }
  };
  const resMock = {
    contentType: jest.fn(),
    send: jest.fn(),
  };
  insertOneMock.mockRejectedValue(new Error('Test'));

  // @ts-ignore
  await postFormHandler(requestMock, resMock, MONGO_URL);

  expect(insertOneMock).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledWith('application/json');
  expect(resMock.send).toBeCalledTimes(1);
  expect(resMock.send).toBeCalledWith(JSON.stringify({result: "ERROR" }));
});

it('invalid data: no first name - should send error result', async () => {
  const requestMock = {
    body: {
      lastName: testData.lastName,
      email: testData.email,
      date: testDateObj.toJSON(),
    }
  };
  const resMock = {
    contentType: jest.fn(),
    send: jest.fn(),
  };
  insertOneMock.mockRejectedValue(new Error('Test'));

  // @ts-ignore
  await postFormHandler(requestMock, resMock, MONGO_URL);

  expect(insertOneMock).toBeCalledTimes(0);
  expect(resMock.contentType).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledWith('application/json');
  expect(resMock.send).toBeCalledTimes(1);
  expect(resMock.send).toBeCalledWith(JSON.stringify({result: "ERROR" }));
});

it('invalid data: last name empty - should send error result', async () => {
  const requestMock = {
    body: {
      firstName: testData.firstName,
      lastName: '',
      email: testData.email,
      date: testDateObj.toJSON(),
    }
  };
  const resMock = {
    contentType: jest.fn(),
    send: jest.fn(),
  };
  insertOneMock.mockRejectedValue(new Error('Test'));

  // @ts-ignore
  await postFormHandler(requestMock, resMock, MONGO_URL);

  expect(insertOneMock).toBeCalledTimes(0);
  expect(resMock.contentType).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledWith('application/json');
  expect(resMock.send).toBeCalledTimes(1);
  expect(resMock.send).toBeCalledWith(JSON.stringify({result: "ERROR" }));
});

it('invalid data: invalid email addres 1 - should send error result', async () => {
  const requestMock = {
    body: {
      firstName: testData.firstName,
      lastName: testData.lastName,
      email: 'Abc.example.com', // invalid no @
      date: testDateObj.toJSON(),
    }
  };
  const resMock = {
    contentType: jest.fn(),
    send: jest.fn(),
  };
  insertOneMock.mockRejectedValue(new Error('Test'));

  // @ts-ignore
  await postFormHandler(requestMock, resMock, MONGO_URL);

  expect(insertOneMock).toBeCalledTimes(0);
  expect(resMock.contentType).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledWith('application/json');
  expect(resMock.send).toBeCalledTimes(1);
  expect(resMock.send).toBeCalledWith(JSON.stringify({result: "ERROR" }));
});

it('invalid data: invalid email addres 2 - should send error result', async () => {
  const requestMock = {
    body: {
      firstName: testData.firstName,
      lastName: testData.lastName,
      email: 666, // not string
      date: testDateObj.toJSON(),
    }
  };
  const resMock = {
    contentType: jest.fn(),
    send: jest.fn(),
  };
  insertOneMock.mockRejectedValue(new Error('Test'));

  // @ts-ignore
  await postFormHandler(requestMock, resMock, MONGO_URL);

  expect(insertOneMock).toBeCalledTimes(0);
  expect(resMock.contentType).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledWith('application/json');
  expect(resMock.send).toBeCalledTimes(1);
  expect(resMock.send).toBeCalledWith(JSON.stringify({result: "ERROR" }));
});

it('invalid data: invalid date - should send error result', async () => {
  const requestMock = {
    body: {
      firstName: testData.firstName,
      lastName: testData.lastName,
      email: testData.email,
      date: 'not date',
    }
  };
  const resMock = {
    contentType: jest.fn(),
    send: jest.fn(),
  };
  insertOneMock.mockRejectedValue(new Error('Test'));

  // @ts-ignore
  await postFormHandler(requestMock, resMock, MONGO_URL);

  expect(insertOneMock).toBeCalledTimes(0);
  expect(resMock.contentType).toBeCalledTimes(1);
  expect(resMock.contentType).toBeCalledWith('application/json');
  expect(resMock.send).toBeCalledTimes(1);
  expect(resMock.send).toBeCalledWith(JSON.stringify({result: "ERROR" }));
});