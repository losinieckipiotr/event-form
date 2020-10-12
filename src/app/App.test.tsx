import React from 'react';
import App from './App';
import { render } from '@testing-library/react'
import store from './store';
import { Provider } from 'react-redux';

it('App renders without crashing', () => {
  render(<Provider store={store}><App/></Provider>);
});
