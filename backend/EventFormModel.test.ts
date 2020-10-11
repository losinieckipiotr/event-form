import mongoose from 'mongoose';
import EventFormModel from './EventFormModel';

const MONGO_URL = process.env.MONGO_URL as string;

beforeAll(async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
});

afterAll(async () => {
  const db = mongoose.connection;
  await db.close();
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

const testData = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan.kowalski@gmail.com',
  date: testDateObj,
};

it('create and safe event form', async () => {
  const form = new EventFormModel(testData);
  const savedForm = await form.save();

  expect(savedForm._id).toBeDefined();
  expect(savedForm.firstName).toBe(testData.firstName);
  expect(savedForm.lastName).toBe(testData.lastName);
  expect(savedForm.email).toBe(testData.email);
  expect(savedForm.date).toBe(testData.date);
});


it('insert form with additional field', async () => {
  const invalidFormData = {...testData, ...{notDefinedPoperty: 'test'}};
  const formWithInvalidField = new EventFormModel(invalidFormData);


  const savedForm = await formWithInvalidField.save() as any;// don't type check for here
  expect(savedForm.firstName).toBe(testData.firstName);
  expect(savedForm.lastName).toBe(testData.lastName);
  expect(savedForm.email).toBe(testData.email);
  expect(savedForm.date).toBe(testData.date);
  expect(savedForm.notDefinedPoperty).toBeUndefined();
});


it('create form without required field', async () => {
  const invalidFormData = {
    // no firstName
    lastName: 'Kowalski',
    email: 'jan.kowalski@gmail.com',
    date: testDateObj,
  };

  const formWithMissingField = new EventFormModel(invalidFormData);

  return expect(formWithMissingField.save()).rejects.toBeInstanceOf(mongoose.Error.ValidationError);
});
