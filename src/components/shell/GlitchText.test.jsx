import React from 'react';
import { render, screen, act } from '@testing-library/react';
import GlitchText from './GlitchText';

jest.useFakeTimers();

describe('GlitchText', () => {
  test('renders the final string after the duration', () => {
    render(<GlitchText duration={100}>hello</GlitchText>);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  test('scramble output has the same length as the final string', () => {
    render(<GlitchText duration={500}>abcdef</GlitchText>);
    act(() => { jest.advanceTimersByTime(50); });
    const node = document.querySelector('[data-testid="glitch-text"]');
    expect(node.textContent.length).toBe(6);
  });

  test('re-scrambles when trigger changes', () => {
    const { rerender } = render(<GlitchText duration={100} trigger={1}>one</GlitchText>);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.getByText('one')).toBeInTheDocument();

    rerender(<GlitchText duration={100} trigger={2}>two</GlitchText>);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.getByText('two')).toBeInTheDocument();
  });
});
