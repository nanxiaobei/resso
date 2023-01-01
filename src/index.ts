import { useSyncExternalStore } from 'use-sync-external-store/shim';

type VoidFn = () => void;
type AnyFn = (...args: unknown[]) => unknown;
type Updater<V> = (val: V) => V;

type Data = Record<string, unknown>;
type State<T> = {
  [K in keyof T]: {
    subscribe: (listener: VoidFn) => VoidFn;
    getSnapshot: () => T[K];
    useSnapshot: () => T[K];
    setSnapshot: (val: T[K]) => void;
  };
};
type Methods<T> = Record<keyof T, AnyFn>;
type Setter<T> = <K extends keyof T>(key: K, updater: Updater<T[K]>) => void;
type Store<T> = T & Setter<T>;

const __DEV__ = process.env.NODE_ENV !== 'production';
const __DEV_ERR__ = (msg: string) => {
  if (__DEV__) {
    throw new Error(msg);
  }
};

let isInMethod = false;
let run = (fn: VoidFn) => {
  fn();
};

const resso = <T extends Data>(data: T): Store<T> => {
  if (__DEV__ && Object.prototype.toString.call(data) !== '[object Object]') {
    throw new Error('object required');
  }

  const state: State<T> = {} as State<T>;
  const methods: Methods<T> = {} as Methods<T>;

  Object.keys(data).forEach((key: keyof T) => {
    const initVal = data[key];

    if (initVal instanceof Function) {
      methods[key] = (...args: unknown[]) => {
        isInMethod = true;
        const res = initVal(...args);
        isInMethod = false;
        return res;
      };
      return;
    }

    const listeners = new Set<VoidFn>();

    state[key] = {
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      getSnapshot: () => data[key],
      setSnapshot: (val) => {
        if (val !== data[key]) {
          data[key] = val;
          run(() => listeners.forEach((listener) => listener()));
        }
      },
      useSnapshot: () => {
        return useSyncExternalStore(
          state[key].subscribe,
          state[key].getSnapshot,
          state[key].getSnapshot
        );
      },
    };
  });

  const setState = (key: keyof T, val: T[keyof T] | Updater<T[keyof T]>) => {
    if (key in data) {
      if (key in state) {
        const newVal = val instanceof Function ? val(data[key]) : val;
        state[key].setSnapshot(newVal);
      } else {
        __DEV_ERR__(`\`${key as string}\` is a method, can not update`);
      }
    } else {
      __DEV_ERR__(`\`${key as string}\` is not initialized in store`);
    }
  };

  return new Proxy(
    (() => undefined) as unknown as Store<T>,
    {
      get: (_, key: keyof T) => {
        if (key in methods) {
          return methods[key];
        }

        if (isInMethod) {
          return data[key];
        }

        try {
          return state[key].useSnapshot();
        } catch (err) {
          return data[key];
        }
      },
      set: (_, key: keyof T, val: T[keyof T]) => {
        setState(key, val);
        return true;
      },
      apply: (_, __, [key, updater]: [keyof T, Updater<T[keyof T]>]) => {
        if (typeof updater === 'function') {
          setState(key, updater);
        } else {
          __DEV_ERR__(`updater for \`${key as string}\` should be a function`);
        }
      },
    } as ProxyHandler<Store<T>>
  );
};

resso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export default resso;
