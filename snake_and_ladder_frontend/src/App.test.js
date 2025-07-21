import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Snake and Ladder screen elements', () => {
  render(<App />);
  const titleElement = screen.getByText(/Snake and Ladder/i);
  expect(titleElement).toBeInTheDocument();
});
