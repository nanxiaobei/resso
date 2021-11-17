import 'jsdom-global/register';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import resso from './index.ts';

configure({ adapter: new Adapter() });

console.error = jest.fn((msg) => {
  if (!msg.includes('test was not wrapped in act(...)')) throw new Error(msg);
});

test('resso', () => {
  const useCounter = resso({
    count: 0,
    open: false,
  });

  const Counter1 = () => {
    const state = useCounter();

    return (
      <>
        <p>{state.count}</p>
        <p>{state.count}</p>
      </>
    );
  };

  const Counter2 = () => {
    const state = useCounter();

    return (
      <>
        <p>{state.count}</p>
        <p>{state.open}</p>
        <button id="add" onClick={() => state.count++} />
        <button id="toggle" onClick={() => (state.open = false)} />
      </>
    );
  };

  const wrapper1 = mount(<Counter1 />);
  const wrapper2 = mount(<Counter2 />);
  const click = (wrapper, btn) => wrapper.find(btn).simulate('click');
  const error = (fn) => expect(fn).toThrow();

  click(wrapper2, '#add');
  click(wrapper2, '#toggle');

  error(() => resso());
  wrapper1.unmount();
  wrapper2.unmount();
});
