import { useSyncExternalStore } from 'use-sync-external-store/shim';

type VoidFn = () => void;
type AnyFn = (...args: unknown[]) => unknown;
type Updater<V> = (val: V) => V;

type Obj = Record<string, unknown>;
type State<T> = {
  [K in keyof T]: {
    subscribe: (listener: VoidFn) => VoidFn;
    getSnapshot: () => T[K];
    useSnapshot: () => T[K];
    setSnapshot: (val: T[K]) => void;
  };
};
type Actions<T> = Record<keyof T, AnyFn>;
type Setter<T> = <K extends keyof T>(key: K, updater: Updater<T[K]>) => void;
type Store<T> = T & Setter<T>;

const __DEV__ = process.env.NODE_ENV !== 'production';

let isInAction = false;
let run = (fn: VoidFn) => {
  fn();
};

const resso = <T extends Obj>(obj: T): Store<T> => {
  if (__DEV__ && Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new Error('object required');
  }

  const state: State<T> = {} as State<T>;
  const actions: Actions<T> = {} as Actions<T>;

  Object.keys(obj).forEach((key: keyof T) => {
    const initVal = obj[key];

    if (initVal instanceof Function) {
      actions[key] = (...args: unknown[]) => {
        isInAction = true;
        const res = initVal(...args);
        isInAction = false;
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
      getSnapshot: () => obj[key],
      setSnapshot: (val) => {
        if (val !== obj[key]) {
          obj[key] = val;
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

  const setState = (key: keyof T, val: T[keyof T] | Updater<T[keyof T]>) => {
    if (key in obj) {
      if (key in state) {
        const newVal = val instanceof Function ? val(obj[key]) : val;
        state[key].setSnapshot(newVal);
      } else if (__DEV__) {
        throw new Error(`'${key as string}' is a function, can not update`);
      }
    } else if (__DEV__) {
      throw new Error(`'${key as string}' is not initialized in store`);
    }
  };

  return new Proxy(
    (() => undefined) as unknown as Store<T>,
    {
      get: (_, key: keyof T) => {
        if (key in actions) {
          return actions[key];
        }

        if (isInAction) {
          return obj[key];
        }

        try {
          return state[key].useSnapshot();
        } catch (err) {
          return obj[key];
        }
      },
      set: (_, key: keyof T, val: T[keyof T]) => {
        setState(key, val);
        return true;
      },
      apply: (_, __, [key, updater]: [keyof T, Updater<T[keyof T]>]) => {
        setState(key, updater);
      },
    } as ProxyHandler<Store<T>>
  );
};

resso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export default resso;
