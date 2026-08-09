import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom';

describe('App default template', () => {
  test('Renders default main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /sandbox pro/i });
    expect(heading).toBeInTheDocument();
  });

  test('Renders default subheading', () => {
    render(<App />);
    const subHeading = screen.getByRole('heading', { name: /your personalised coding environment/i });
    expect(subHeading).toBeInTheDocument();
  });
});