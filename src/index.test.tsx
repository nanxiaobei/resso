import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { expect, test } from 'vitest';
import resso from './index';

test('resso', () => {
  const store = resso({
    count: 0,
    list: [],
    incOneA: () => (store.count += 1),
    incOneB: () => store('count', (prev) => prev + 1),
    incMoreA: () => store({ count: store.count + 1 }),
    incMoreB: () => store(({ count }) => ({ count: count + 1 })),
  });

  const App = () => {
    const { count } = store;
    return (
      <>
        <p>{count}</p>
        <button onClick={store.incOneA}>btn1</button>
        <button onClick={store.incOneB}>btn2</button>
        <button onClick={() => (store.count += 1)}>btn3</button>
        <button onClick={store.incMoreA}>btn4</button>
        <button onClick={store.incMoreB}>btn5</button>
      </>
    );
  };

  const { getByText } = render(<App />);

  expect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resso();
  }).toThrow();

  expect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { a } = store;
    a?.();
  }).toThrow();

  expect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.a = 1;
  }).toThrow();

  expect(() => {
    store.incOneA = () => -1;
  }).toThrow();

  fireEvent.click(getByText('btn1'));
  expect(getByText('1')).toBeInTheDocument();

  fireEvent.click(getByText('btn2'));
  expect(getByText('2')).toBeInTheDocument();

  fireEvent.click(getByText('btn3'));
  expect(getByText('3')).toBeInTheDocument();

  fireEvent.click(getByText('btn4'));
  expect(getByText('4')).toBeInTheDocument();

  fireEvent.click(getByText('btn5'));
  expect(getByText('5')).toBeInTheDocument();
});

test('resso.config', () => {
  resso.config({ batch: ReactDOM.unstable_batchedUpdates });
});
