import React from 'react';
import ReactDOM from 'react-dom';
import { test, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import resso from './index';

test('resso', () => {
  const store = resso({
    count: 0,
    inc: () => store.count++,
  });

  const App = () => {
    const { count, inc } = store;
    return (
      <>
        <p>{count}</p>
        <button onClick={inc}>btn1</button>
        <button onClick={() => store.count++}>btn2</button>
        <button onClick={() => (store.count = count)}>btn3</button>
      </>
    );
  };

  const { getByText } = render(<App />);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(() => resso()).toThrow();

  fireEvent.click(getByText('btn1'));
  expect(getByText('1')).toBeInTheDocument();

  fireEvent.click(getByText('btn2'));
  expect(getByText('2')).toBeInTheDocument();

  fireEvent.click(getByText('btn3'));
  expect(getByText('2')).toBeInTheDocument();
});

test('resso.config', () => {
  resso.config({ batch: ReactDOM.unstable_batchedUpdates });
});
