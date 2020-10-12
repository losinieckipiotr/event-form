import mongoose from 'mongoose';
import EventFormModel, { EventFormData } from './EventFormModel';

export default function insertOne(data: EventFormData, dbUrl: string) {
  return mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    const form = new EventFormModel(data);
    return form.save();
  }).then(() => {
    console.log('Inserted new event form');
  });
}
