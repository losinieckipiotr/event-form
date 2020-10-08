import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface FormState {
  firstName: string,
  lastName: string;
  email: string;
  date: string;
  msg: string[];
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  date: '',
  msg: [],
};

export const slice  = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setMsg: (state, action: PayloadAction<string>) => {
      state.msg.push(action.payload);
    },
  },
});

export const { setFirstName, setLastName, setEmail, setDate, setMsg } = slice.actions;

export const selectFirstName = (state: RootState) => state.form.firstName;
export const selectLastName = (state: RootState) => state.form.lastName;
export const selectEmail = (state: RootState) => state.form.email;
export const selectDate = (state: RootState) => state.form.date;
export const selectMsg = (state: RootState) => state.form.msg;

export default slice.reducer;
