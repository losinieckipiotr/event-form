import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface FormState {
  firstName: string,
  lastName: string;
  email: string;
  date: string;
  result: 'SUCCESS' | 'FAILURE' | undefined;
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  date: '',
  result: undefined,
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
    setSuccess: (state) => {
      state.result = 'SUCCESS';
    },
    setFailure: (state) => {
      state.result = 'FAILURE';
    },
    closeModal: (state) => {
      if (state.result === 'SUCCESS') {
        state.firstName = '';
        state.lastName = '';
        state.email = '';
        state.date ='';
      }
      state.result = undefined;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setDate,
  setSuccess,
  setFailure,
  closeModal,
} = slice.actions;

export const selectFirstName = (state: RootState) => state.form.firstName;
export const selectLastName = (state: RootState) => state.form.lastName;
export const selectEmail = (state: RootState) => state.form.email;
export const selectDate = (state: RootState) => state.form.date;
export const selectResult = (state: RootState) => state.form.result;

export default slice.reducer;
