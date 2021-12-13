import React from 'react';
import ReactDOM from 'react-dom';
import Currencies from './Currencies';

describe('Currencies component test', () => {

  it('must render Currencies component without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Currencies />, div);
    ReactDOM.unmountComponentAtNode(div);
  })
  
});