import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';

type Store = Record<string, any>;
type State<T> = { [K in keyof T]: () => T[K] };
type Setter<T> = { [key in keyof T]: Set<Dispatch<SetStateAction<T[keyof T]>>> };

const __DEV__ = process.env.NODE_ENV !== 'production';
const notObj = (val: any) => Object.prototype.toString.call(val) !== '[object Object]';

function resso<T extends Store>(store: T): T {
  if (__DEV__ && notObj(store)) throw new Error('store should be an object');

  const state: State<T> = {} as State<T>;
  const setter: Setter<T> = {} as Setter<T>;

  Object.keys(store).forEach((key: keyof T) => {
    if (typeof store[key] === 'function') return;

    const listeners: Set<Dispatch<SetStateAction<T[keyof T]>>> = new Set();
    setter[key] = listeners;

    const Render = () => {
      const [value, setValue] = useState(() => store[key]);
      useMemo(() => listeners.add(setValue), []);
      useEffect(() => () => listeners.delete(setValue) as unknown as void, []);
      return value;
    };

    state[key] = Render;
  });

  return new Proxy(store, {
    get(_, key: keyof T) {
      try {
        return state[key]();
      } catch (e) {
        return store[key];
      }
    },
    set(_, key: keyof T, val: T[keyof T]) {
      if (val !== store[key]) {
        const updater = () => {
          store[key] = val;
          setter[key].forEach((setValue) => setValue(val));
        };
        /* istanbul ignore next */
        typeof batch === 'function' ? batch(updater) : updater();
      }
      return true;
    },
  } as ProxyHandler<T>);
}

export default resso;
