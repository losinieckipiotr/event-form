import mongoose from 'mongoose';
import insertOne from './insertOne';

const MONGO_URL = process.env.MONGO_URL as string;

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

it('insertOne resolves successfully', async () => {
  return expect(insertOne(testData, MONGO_URL)).resolves.toBeUndefined();
});
