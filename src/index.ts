import { useSyncExternalStore } from 'use-sync-external-store/shim';

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

let run = (fn: VoidFn) => {
  fn();
};

let hasWarned = false;

const resso = <Data extends Record<string, unknown>>(
  data: Data,
): Store<Data> => {
  /* v8 ignore next 6 */
  if (__DEV__ && !hasWarned) {
    hasWarned = true;
    console.info(
      '[resso] Since v0.26.0: Please use `const { xxx } = store.useStore()` in components to get state. Direct access `const { xxx } = store` is now for pure data reads. https://github.com/nanxiaobei/resso',
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

  const state: State = {} as State;
  const actions: Actions = {} as Actions;

  Object.keys(data).forEach((key: K) => {
    if (key === 'useStore') throw new Error('`useStore` is a reserved key');

    const initVal = data[key];

    // state
    if (typeof initVal !== 'function') {
      const setters = new Set<VoidFn>();
      state[key] = {
        subscribe: (setter) => {
          setters.add(setter);
          return () => setters.delete(setter);
        },
        getSnapshot: () => data[key],
        triggerUpdate: () => setters.forEach((setter) => setter()),
      };
      return;
    }

    // actions
    actions[key] = initVal as AnyFn;
  });

  function Target() {}
  const protoKeys = new Set([
    ...Object.getOwnPropertyNames(Target),
    'displayName',
  ]);

  const setValue = (key: K, val: unknown | SetKeyAction<V>) => {
    if (key in state) {
      const newVal = val instanceof Function ? val(data[key]) : val;
      if (data[key] !== newVal) {
        data[key] = newVal;
        run(() => state[key].triggerUpdate());
      }
      return;
    }

    /* v8 ignore next 9 */
    if (__DEV__) {
      if (key in actions) {
        throw new Error(`\`${key as string}\` is an action, can not update`);
      }
      if (key === 'useStore') throw new Error('`useStore` is a reserved key');
      if (!protoKeys.has(key as string)) {
        throw new Error(`\`${key as string}\` is not initialized in store`);
      }
    }
  };

  const store = new Proxy(
    Object.assign(Target, data) as unknown as Store<Data>,
    {
      get: (_target, key: K) => {
        if (key === 'useStore') return useStore;
        if (key in data) return data[key];

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
          const newData = key as Data;
          Object.keys(newData).forEach((k) => {
            setValue(k, newData[k]);
          });
          return;
        }

        // store(prev => next)
        if (typeof key === 'function') {
          const newData = key(data);
          Object.keys(newData).forEach((k) => {
            setValue(k, newData[k]);
          });
        }
      },
    } as ProxyHandler<Store<Data>>,
  );

  const hookStore = new Proxy(data, {
    get: (_target, key: K) => {
      if (key in actions) return actions[key];

      if (key in state) {
        return useSyncExternalStore(
          state[key].subscribe,
          state[key].getSnapshot,
          state[key].getSnapshot,
        );
      }

      /* v8 ignore next 6 */
      if (__DEV__) {
        if (key === 'useStore') throw new Error('`useStore` is a reserved key');
        if (!protoKeys.has(key as string)) {
          throw new Error(`\`${key as string}\` is not initialized in store`);
        }
      }
    },
  } as ProxyHandler<Data>);

  const useStore = () => hookStore;

  return store;
};

resso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export default resso;
