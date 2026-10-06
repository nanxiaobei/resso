import '@testing-library/jest-dom/vitest';
import { fireEvent, render } from '@testing-library/react';
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
    const { count, incOneA } = store.useStore();
    return (
      <>
        <p>{count}</p>
        <button onClick={incOneA}>btn1</button>
        <button onClick={store.incOneB}>btn2</button>
        <button onClick={() => (store.count += 1)}>btn3</button>
        <button onClick={store.incMoreA}>btn4</button>
        <button onClick={store.incMoreB}>btn5</button>
      </>
    );
  };

  const { getByText } = render(<App />);

  expect(() => {
    // @ts-expect-error
    resso();
  }).toThrow();

  expect(() => {
    resso({ useStore: 1 });
  }).toThrow();

  expect(typeof store.useStore).toBe('function');
  expect(store.list.map((x) => x)).toEqual([]);

  store.count = 0;

  expect(() => {
    // @ts-expect-error
    // oxlint-disable-next-line no-unused-expressions
    store.a;
  }).toThrow();

  expect(() => {
    // @ts-expect-error
    // oxlint-disable-next-line no-unused-expressions
    store.useStore().a;
  }).toThrow();

  expect(() => {
    // @ts-expect-error
    store.a = 1;
  }).toThrow();

  expect(() => {
    const s = resso({
      action: () => s.useStore(),
    });
    s.action();
  }).toThrow();

  // @ts-expect-error
  store(1);

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

  const NonReactiveComp = () => {
    const count = store.count;
    return <p>non-reactive: {count}</p>;
  };
  expect(() => render(<NonReactiveComp />)).not.toThrow();
});
