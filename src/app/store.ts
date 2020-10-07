import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import formReducer from '../form/formSlice';

const store = configureStore({
  reducer: {
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
