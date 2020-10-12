import mongoose, { Schema, Document } from 'mongoose';

export interface EventFormData {
  firstName: string;
  lastName: string;
  email: string;
  date: Date;
}

export interface IEventForm extends EventFormData, Document {
}

// Create a simple User's schema
const evetFormSchema = new Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, required: true },
  date: { type: Date, required: true },
});

const EventFormModel = mongoose.model<IEventForm>('EventForm', evetFormSchema);

export default EventFormModel;
