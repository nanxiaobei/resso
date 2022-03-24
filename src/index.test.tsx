import React from 'react';
import { it, expect } from 'vitest';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jsdom-global/register';
import resso from './index';

configure({ adapter: new Adapter() });

it('resso', () => {
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
  const error = (fn: () => void) => expect(fn).toThrow();
  const click = (btn: string) => wrapper.find(btn).simulate('click');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  error(() => resso());
  click('#add1');
  click('#add2');
  click('#add3');

  wrapper.unmount();
});
