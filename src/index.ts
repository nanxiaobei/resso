import { useSyncExternalStore } from 'use-sync-external-store/shim';

type VoidFn = () => void;
type AnyFn = (...args: unknown[]) => unknown;

type OneAction<V> = V | ((val: V) => V);
type ObjUpdater<Obj> = (obj: Obj) => Partial<Obj>;

type Setter<Obj> = {
  <K extends keyof Obj>(key: K, oneAction: OneAction<Obj[K]>): void;
  (obj: Partial<Obj>): void;
  (objUpdater: ObjUpdater<Obj>): void;
};

type Store<Obj> = Obj & Setter<Obj>;

const __DEV__ = process.env.NODE_ENV !== 'production';

const isObj = (val: unknown) => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

let isGetStateInMethod = false;
let run = (fn: VoidFn) => {
  fn();
};

const resso = <Obj extends Record<string, unknown>>(obj: Obj): Store<Obj> => {
  type K = keyof Obj;
  type V = Obj[K];
  type State = Record<
    K,
    {
      subscribe: (listener: VoidFn) => VoidFn;
      getSnapshot: () => Obj[K];
      useSnapshot: () => Obj[K];
      setSnapshot: (val: Obj[K]) => void;
    }
  >;
  type Methods = Record<K, AnyFn>;

  if (__DEV__ && !isObj(obj)) {
    throw new Error('object required');
  }

  const state: State = {} as State;
  const methods: Methods = {} as Methods;

  Object.keys(obj).forEach((key: K) => {
    const initVal = obj[key];

    if (initVal instanceof Function) {
      methods[key] = (...args: unknown[]) => {
        isGetStateInMethod = true;
        const res = initVal(...args);
        isGetStateInMethod = false;
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
          state[key].getSnapshot,
          state[key].getSnapshot,
        );
      },
    };
  });

  const setState = (key: K, val: unknown | OneAction<V>) => {
    if (key in obj) {
      if (key in state) {
        const newVal = val instanceof Function ? val(obj[key]) : val;
        state[key].setSnapshot(newVal as V);
      } else if (__DEV__) {
        throw new Error(`\`${key as string}\` is a method, can not update`);
      }
    } else if (__DEV__) {
      throw new Error(`\`${key as string}\` is not initialized in store`);
    }
  };

  return new Proxy(
    (() => undefined) as unknown as Store<Obj>,
    {
      get: (_target, key: K) => {
        if (key in methods) {
          return methods[key];
        }

        if (key in state) {
          if (isGetStateInMethod) {
            return obj[key];
          }

          try {
            return state[key].useSnapshot();
          } catch (err) {
            return obj[key];
          }
        }

        if (__DEV__) {
          if (key !== 'prototype' && key !== 'name' && key !== 'displayName') {
            throw new Error(`\`${key as string}\` is not initialized in store`);
          }
        }
      },
      set: (_target, key: K, val: V) => {
        setState(key, val);
        return true;
      },
      apply: (
        _target,
        _thisArg,
        [firstArg, oneAction]: [K | Obj | ObjUpdater<Obj>, OneAction<V>],
      ) => {
        if (typeof firstArg === 'string') {
          setState(firstArg, oneAction);
          return;
        }

        if (isObj(firstArg)) {
          const newObj = firstArg as Obj;
          Object.keys(newObj).forEach((key) => {
            setState(key, newObj[key]);
          });
          return;
        }

        if (typeof firstArg === 'function') {
          const newObj = firstArg(obj);
          Object.keys(newObj).forEach((key) => {
            setState(key, newObj[key]);
          });
        }
      },
    } as ProxyHandler<Store<Obj>>,
  );
};

resso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export default resso;
