import { useEffect, useReducer, useMemo, DispatchWithoutAction } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

type Store = Record<string, any>;
type State<T> = { [key in keyof T]: () => T[keyof T] };
type Updater<T> = { [key in keyof T]: Set<DispatchWithoutAction> };
type Actions<T> = { [key in keyof T]: (...args: any[]) => any };

const reducer = (s: boolean) => !s;
const __DEV__ = process.env.NODE_ENV !== 'production';
const notObj = (val: any) => Object.prototype.toString.call(val) !== '[object Object]';

function resso<T extends Store>(store: T): T {
  if (__DEV__ && notObj(store)) throw new Error('store should be an object');

  const state: State<T> = {} as State<T>;
  const updater: Updater<T> = {} as Updater<T>;
  const actions: Actions<T> = {} as Actions<T>;

  Object.keys(store).forEach((key: keyof T) => {
    const val = store[key];
    if (typeof val === 'function') {
      actions[key] = val;
      return;
    }

    const listeners = new Set<DispatchWithoutAction>();
    updater[key] = listeners;
    const Val = () => {
      const [, dispatch] = useReducer(reducer, false);
      useMemo(() => listeners.add(dispatch), []);
      useEffect(() => () => listeners.delete(dispatch) as unknown as void, []);
      return store[key];
    };
    state[key] = Val;
  });

  return new Proxy(store, {
    get(_, key: keyof T) {
      if (key in actions) return actions[key];
      try {
        return state[key]();
      } catch (e) {
        return store[key];
      }
    },
    set(_, key: keyof T, val: T[keyof T]) {
      if (val !== store[key]) {
        store[key] = val;
        unstable_batchedUpdates(() => {
          updater[key].forEach((listener) => listener());
        });
      }
      return true;
    },
  } as ProxyHandler<T>);
}

export default resso;
