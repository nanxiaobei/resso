import { useSyncExternalStore } from 'use-sync-external-store/shim';

type Callback = () => void;
type Method = (...args: unknown[]) => unknown;
type Store = Record<string, unknown>;
type State<T> = {
  [K in keyof T]: {
    subscribe: (listener: Callback) => Callback;
    getSnapshot: () => T[K];
    useSnapshot: () => T[K];
    setSnapshot: (val: T[K]) => void;
  };
};

const __DEV__ = process.env.NODE_ENV !== 'production';

let isInFunction = false;
let run = (fn: Callback) => {
  fn();
};

const resso = <T extends Store>(store: T): T => {
  if (__DEV__ && Object.prototype.toString.call(store) !== '[object Object]') {
    throw new Error('object required');
  }

  const state: State<T> = {} as State<T>;

  Object.keys(store).forEach((key: keyof T) => {
    if (typeof store[key] === 'function') {
      return;
    }

    const listeners = new Set<Callback>();
    state[key] = {
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      getSnapshot: () => store[key],
      setSnapshot: (val) => {
        if (val !== store[key]) {
          store[key] = val;
          run(() => listeners.forEach((listener) => listener()));
        }
      },
      useSnapshot: () => {
        return useSyncExternalStore(
          state[key].subscribe,
          state[key].getSnapshot
        );
      },
    };
  });

  return new Proxy(store, {
    get: (_, key: keyof T) => {
      if (typeof store[key] === 'function') {
        return (...args: unknown[]) => {
          isInFunction = true;
          const res = (store[key] as Method)(...args);
          isInFunction = false;
          return res;
        };
      }

      if (isInFunction) {
        return store[key];
      }

      try {
        return state[key].useSnapshot();
      } catch (err) {
        return store[key];
      }
    },
    set: (_, key: keyof T, val: T[keyof T]) => {
      if (key in store) {
        if (typeof store[key] !== 'function') {
          state[key].setSnapshot(val);
        } else if (__DEV__) {
          throw new Error(`${key as string} is a function, can not update`);
        }
      } else if (__DEV__) {
        throw new Error(`${key as string} is not initialized in store`);
      }

      return true;
    },
  } as ProxyHandler<T>);
};

resso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export default resso;
