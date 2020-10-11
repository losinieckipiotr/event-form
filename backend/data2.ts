import mongoose from 'mongoose';
import EventFormModel from './EventFormModel';

export function insertOne(firstName : string, lastName: string, email: string, date: Date) {
  // const url = 'mongodb://superuser:123456789@localhost:27017/admin';
  const url = process.env.DB_URL;
  if (url === undefined) {
    throw new Error('Missing DB URL');
  }

  return mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    const dataToSave = {
      firstName,
      lastName,
      email,
      date,
    };

    const form = new EventFormModel(dataToSave);
    return form.save();
  }).then(() => {
    console.log('Inserted new event form');
  });
}
