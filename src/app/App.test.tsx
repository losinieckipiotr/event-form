import '@testing-library/jest-dom/extend-expect';
// import configureMockStore from 'redux-mock-store';

import React from 'react';
import App from './App';
import '@testing-library/jest-dom'
import 'jest-canvas-mock';
import { render } from '@testing-library/react'
import store from './store';
import { Provider } from 'react-redux';

it('App renders without crashing', () => {
  render(<Provider store={store}><App/></Provider>);
});
