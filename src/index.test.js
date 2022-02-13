import 'jsdom-global/register';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import resso from './index.ts';

configure({ adapter: new Adapter() });

console.error = jest.fn((msg) => {
  if (msg.includes('test was not wrapped in act(...)')) return;
  throw new Error(msg);
});

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
        <button id="add1" onClick={inc} />
        <button id="add2" onClick={() => store.count++} />
        <button id="add3" onClick={() => (store.count = +count)} />
      </>
    );
  };

  const wrapper = mount(<App />);
  const error = (fn) => expect(fn).toThrow();
  const click = (btn) => wrapper.find(btn).simulate('click');

  error(() => resso());
  click('#add1');
  click('#add2');
  click('#add3');

  wrapper.unmount();
});
