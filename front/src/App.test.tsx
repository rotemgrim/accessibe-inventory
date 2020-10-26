import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('check if react renders', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/accessiBe - Inventory Management System/i);
  expect(linkElement).toBeInTheDocument();
});
