import ReactDOM from 'react-dom';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
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
        <button onClick={() => store('count', (prev) => prev + 1)}>btn3</button>
      </>
    );
  };

  const { getByText } = render(<App />);

  expect(() => {
    // @ts-ignore
    resso();
  }).toThrow();

  expect(() => {
    // @ts-ignore
    store.a = 1;
  }).toThrow();

  expect(() => {
    // @ts-ignore
    store('count', 1);
  }).toThrow();

  expect(() => {
    store.inc = () => -1;
  }).toThrow();

  fireEvent.click(getByText('btn1'));
  expect(getByText('1')).toBeInTheDocument();

  fireEvent.click(getByText('btn2'));
  expect(getByText('2')).toBeInTheDocument();

  fireEvent.click(getByText('btn3'));
  expect(getByText('3')).toBeInTheDocument();
});

test('resso.config', () => {
  resso.config({ batch: ReactDOM.unstable_batchedUpdates });
});
