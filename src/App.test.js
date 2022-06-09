import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app name', () => {
  render(<App />);
  const linkElement = screen.getByText(/DDrop/i);
  expect(linkElement).toBeInTheDocument();
});
