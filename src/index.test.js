import 'jsdom-global/register';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import useResso from './index.ts';

configure({ adapter: new Adapter() });

console.error = jest.fn((msg) => {
  if (!msg.includes('test was not wrapped in act(...)')) throw new Error(msg);
});

test('useResso', () => {
  const counter = {
    count: 0,
    open: false,
  };

  const Counter1 = () => {
    const $ = useResso(counter);

    return (
      <>
        <p>{$.count}</p>
        <p>{$.count}</p>
      </>
    );
  };

  const Counter2 = () => {
    const $ = useResso(counter);

    return (
      <>
        <p>{$.count}</p>
        <p>{$.open}</p>
        <button id="add" onClick={() => $.count++} />
        <button id="toggle" onClick={() => ($.open = false)} />
      </>
    );
  };

  const wrapper1 = mount(<Counter1 />);
  const wrapper2 = mount(<Counter2 />);
  const click = (wrapper, btn) => wrapper.find(btn).simulate('click');
  const error = (fn) => expect(fn).toThrow();

  click(wrapper2, '#add');
  click(wrapper2, '#toggle');

  error(() => useResso());
  wrapper1.unmount();
  wrapper2.unmount();
});
