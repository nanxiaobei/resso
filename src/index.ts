import { useSyncExternalStore } from 'use-sync-external-store/shim';

type Store = Record<string, unknown>;
type Action = (...args: unknown[]) => unknown;
type Actions<T> = Record<keyof T, Action>;
type Callback = () => void;
type State<T> = {
  [K in keyof T]: {
    subscribe: (listener: Callback) => Callback;
    getSnapshot: () => T[K];
    useSnapshot: () => T[K];
    setSnapshot: (val: T[K]) => void;
  };
};

const __DEV__ = process.env.NODE_ENV !== 'production';

let isInAction = false;
let run = (fn: Callback) => {
  fn();
};

const resso = <T extends Store>(store: T): T => {
  if (__DEV__ && Object.prototype.toString.call(store) !== '[object Object]') {
    throw new Error('object required');
  }

  const state: State<T> = {} as State<T>;
  const actions: Actions<T> = {} as Actions<T>;

  Object.keys(store).forEach((key: keyof T) => {
    if (typeof store[key] === 'function') {
      const rawAction = store[key];
      actions[key] = (...args: unknown[]) => {
        isInAction = true;
        const res = (rawAction as Action)(...args);
        isInAction = false;
        return res;
      };
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
      if (key in actions) {
        return actions[key];
      }

      if (isInAction) {
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
        if (key in state) {
          state[key].setSnapshot(val);
        } else if (__DEV__) {
          throw new Error(`'${key as string}' is a function, can not update`);
        }
      } else if (__DEV__) {
        throw new Error(`'${key as string}' is not initialized in store`);
      }

      return true;
    },
  } as ProxyHandler<T>);
};

resso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export default resso;
