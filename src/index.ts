import { useSyncExternalStore } from 'react';

type VoidFn = () => void;
type AnyFn = (...args: unknown[]) => unknown;

type SetKeyAction<V> = V | ((prev: V) => V);
type SetDataAction<V> = Partial<V> | ((prev: V) => Partial<V>);

type SetStore<Data> = {
  <K extends keyof Data>(key: K, val: SetKeyAction<Data[K]>): void;
  (payload: SetDataAction<Data>): void;
};

type Store<Data> = Data & SetStore<Data> & { useStore: () => Data };

const __DEV__ = process.env.NODE_ENV !== 'production';

const isObj = (val: unknown) =>
  Object.prototype.toString.call(val) === '[object Object]';

let hasWarned = false;
let methodDepth = 0;

const protoKeys = new Set([
  ...Object.getOwnPropertyNames(() => {}),
  'displayName',
]);

const resso = <Data extends Record<string, unknown>>(
  data: Data,
): Store<Data> => {
  /* v8 ignore next 6 */
  if (__DEV__ && !hasWarned) {
    hasWarned = true;
    console.info(
      '##### [resso] Since v0.29.0: Please use `const { xxx } = store.useStore()` in components to get state. Direct access `const { xxx } = store` is now for pure data reads. https://github.com/nanxiaobei/resso #####',
    );
  }

  type K = keyof Data;
  type V = Data[K];
  type Actions = Record<K, AnyFn>;
  type State = Record<
    K,
    {
      subscribe: (setter: VoidFn) => VoidFn;
      getSnapshot: () => Data[K];
      triggerUpdate: () => void;
    }
  >;

  if (__DEV__ && !isObj(data)) {
    throw new Error('object required');
  }

  const obj = { ...data };
  const state: State = {} as State;
  const actions: Actions = {} as Actions;

  Object.keys(obj).forEach((key: K) => {
    if (__DEV__ && key === 'useStore') {
      throw new Error('`useStore` is a reserved key');
    }

    const initVal = obj[key];

    // state
    if (typeof initVal !== 'function') {
      const setters = new Set<VoidFn>();
      state[key] = {
        subscribe: (setter) => {
          setters.add(setter);
          return () => setters.delete(setter);
        },
        getSnapshot: () => obj[key],
        triggerUpdate: () => setters.forEach((setter) => setter()),
      };
      return;
    }

    // actions
    const newAction = (...args: unknown[]) => {
      methodDepth++;
      try {
        return (initVal as AnyFn)(...args);
      } finally {
        methodDepth--;
      }
    };
    actions[key] = newAction;
    obj[key] = newAction as Data[keyof Data];
  });

  const Target = () => {};

  const setValue = (key: K, val: unknown | SetKeyAction<V>) => {
    if (key in state) {
      const newVal = typeof val === 'function' ? val(obj[key]) : val;
      if (obj[key] !== newVal) {
        obj[key] = newVal;
        state[key].triggerUpdate();
      }
      return;
    }

    /* v8 ignore next 9 */
    if (__DEV__) {
      if (key in actions) {
        throw new Error(`\`${key as string}\` is an action, can not update`);
      }
      if (key === 'useStore') {
        throw new Error('`useStore` is a reserved key');
      }
      if (!protoKeys.has(key as string)) {
        throw new Error(`\`${key as string}\` is not initialized in store`);
      }
    }
  };

  const store = new Proxy(
    Object.assign(Target, obj) as unknown as Store<Data>,
    {
      get: (_target, key: K) => {
        if (key === 'useStore') return useStore;
        if (key in obj) return obj[key];

        /* v8 ignore next 3 */
        if (__DEV__ && !protoKeys.has(key as string)) {
          throw new Error(`\`${key as string}\` is not initialized in store`);
        }
      },
      set: (_target, key: K, val: V) => {
        setValue(key, val);
        return true;
      },
      apply: (
        _target,
        _thisArg,
        [key, updater]: [K | SetDataAction<Data>, SetKeyAction<V>],
      ) => {
        // store('key', val)
        if (typeof key === 'string') {
          setValue(key, updater);
          return;
        }

        // store({ key: val })
        if (isObj(key)) {
          const newObj = key as Data;
          Object.keys(newObj).forEach((k) => {
            setValue(k, newObj[k]);
          });
          return;
        }

        // store(prev => next)
        if (typeof key === 'function') {
          const newObj = key(obj);
          Object.keys(newObj).forEach((k) => {
            setValue(k, newObj[k]);
          });
        }
      },
    } as ProxyHandler<Store<Data>>,
  );

  const hookStore = new Proxy(obj, {
    get: (_target, key: K) => {
      if (key in state) {
        return useSyncExternalStore(
          state[key].subscribe,
          state[key].getSnapshot,
          state[key].getSnapshot,
        );
      }

      if (key in actions) return actions[key];

      /* v8 ignore next 6 */
      if (__DEV__) {
        if (key === 'useStore') {
          throw new Error('`useStore` is a reserved key');
        }
        if (!protoKeys.has(key as string)) {
          throw new Error(`\`${key as string}\` is not initialized in store`);
        }
      }
    },
  } as ProxyHandler<Data>);

  const useStore = () => {
    if (methodDepth > 0) {
      throw new Error('`useStore` cannot be called inside store functions');
    }
    return hookStore;
  };

  return store;
};

export default resso;
