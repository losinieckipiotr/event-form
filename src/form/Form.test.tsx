import React from 'react';
import ReactDOM from 'react-dom';
import From from './Form';

it('Form renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<From />, div);
});
