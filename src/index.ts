import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

type Store = Record<string, any>;
type Render<T> = { [K in keyof T]: () => T[K] };
type Actions<T> = { [key in keyof T]: (...args: any[]) => any };
type Updater<T> = { [key in keyof T]: Set<Dispatch<SetStateAction<T[keyof T]>>> };

const __DEV__ = process.env.NODE_ENV !== 'production';
const notObj = (val: any) => Object.prototype.toString.call(val) !== '[object Object]';

function resso<T extends Store>(store: T): T {
  if (__DEV__ && notObj(store)) throw new Error('store should be an object');

  const render: Render<T> = {} as Render<T>;
  const actions: Actions<T> = {} as Actions<T>;
  const updater: Updater<T> = {} as Updater<T>;

  Object.keys(store).forEach((key: keyof T) => {
    const initVal = store[key];
    if (typeof initVal === 'function') {
      actions[key] = initVal;
      return;
    }
    const listeners: Set<Dispatch<SetStateAction<T[keyof T]>>> = new Set();
    updater[key] = listeners;
    const Val = () => {
      const [state, setState] = useState(initVal);
      useMemo(() => listeners.add(setState), []);
      useEffect(() => () => listeners.delete(setState) as unknown as void, []);
      return state;
    };
    render[key] = Val;
  });

  return new Proxy(store, {
    get(_, key: keyof T) {
      if (key in actions) return actions[key];
      try {
        return render[key]();
      } catch (e) {
        return store[key];
      }
    },
    set(_, key: keyof T, val: T[keyof T]) {
      if (val !== store[key]) {
        unstable_batchedUpdates(() => {
          store[key] = val;
          updater[key].forEach((setState) => setState(val));
        });
      }
      return true;
    },
  } as ProxyHandler<T>);
}

export default resso;
