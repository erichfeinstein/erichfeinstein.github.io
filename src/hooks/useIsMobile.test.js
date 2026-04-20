import React from 'react';
import { render, act } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

function Probe({ query }) {
  const isMobile = useIsMobile(query);
  return <span data-testid="result">{isMobile ? 'yes' : 'no'}</span>;
}

describe('useIsMobile', () => {
  let listeners;
  let matches;

  beforeEach(() => {
    listeners = [];
    matches = false;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      addEventListener: (_evt, cb) => listeners.push(cb),
      removeEventListener: (_evt, cb) => {
        const i = listeners.indexOf(cb);
        if (i >= 0) listeners.splice(i, 1);
      },
    }));
  });

  test('returns false when query does not match on mount', () => {
    matches = false;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('result').textContent).toBe('no');
  });

  test('returns true when query matches on mount', () => {
    matches = true;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('result').textContent).toBe('yes');
  });

  test('updates when matchMedia fires a change event', () => {
    matches = false;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('result').textContent).toBe('no');

    act(() => {
      listeners.forEach((cb) => cb({ matches: true }));
    });
    expect(getByTestId('result').textContent).toBe('yes');
  });

  test('uses default query when none supplied', () => {
    matches = false;
    render(<Probe />);
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 700px)');
  });

  test('uses custom query when supplied', () => {
    matches = false;
    render(<Probe query="(max-width: 500px)" />);
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 500px)');
  });

  test('removes listener on unmount', () => {
    matches = false;
    const { unmount } = render(<Probe />);
    expect(listeners.length).toBe(1);
    unmount();
    expect(listeners.length).toBe(0);
  });
});
