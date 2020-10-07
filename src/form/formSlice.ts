import { createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface FormState {
  firstName: string,
  lastName: string;
  email: string;
  date: string;
  msg: string;
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  date: '',
  msg: '',
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
      state.msg = action.payload;
    },
  },
});

export const { setFirstName, setLastName, setEmail, setDate, setMsg } = slice.actions;

export default slice.reducer;
