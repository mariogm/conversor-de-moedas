import React from 'react';
import ReactDM from 'react-dom';
import App from './App';
import { render, fireEvent } from '@testing-library/react';
import axiosMock from 'axios';

describe('Currency component tests suite', () => {
  
  it('renders react App component', () => {
    render(<App />)
  });

  it('simulates currency conversion request and response', async () => {
    const { findByTestId, getByTestId } = render(<App/>);
    axiosMock.get.mockResolvedValueOnce({
      data: {
        success: true,
        rates: {
          BRL: 6.351515,
          USD: 1.131676
        }
      }
    });

    fireEvent.click(getByTestId('btn-convert'));

    const modal = await findByTestId('res-modal');

    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(modal).toHaveTextContent('A conversão de 1 BRL é igual a 0.18 USD');

  });

});

