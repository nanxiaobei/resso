import 'jsdom-global/register';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import resso from './index.ts';

configure({ adapter: new Adapter() });

console.error = jest.fn((msg) => {
  if (!msg.includes('test was not wrapped in act(...)')) throw new Error(msg);
});

const error = (fn) => expect(fn).toThrow();
const click = (wrapper, btn) => wrapper.find(btn).simulate('click');

test('resso', () => {
  const useCounter = resso({
    count: 0,
  });

  const Counter = () => {
    const state = useCounter();

    return (
      <>
        <p>{state.count}</p>
        <p>{state.count}</p>
        <button id="add" onClick={() => state.count++} />
      </>
    );
  };

  const wrapper = mount(<Counter />);
  error(() => resso());
  click(wrapper, '#add');

  wrapper.unmount();
});
