import { useSyncExternalStore } from 'use-sync-external-store/shim';

type VoidFn = () => void;
type AnyFn = (...args: unknown[]) => unknown;

type KeyUpdater<V> = V | ((prev: V) => V);
type DataUpdater<V> = Partial<V> | ((prev: V) => Partial<V>);

type SetStore<Data> = {
  <K extends keyof Data>(key: K, updater: KeyUpdater<Data[K]>): void;
  (updater: DataUpdater<Data>): void;
};

type Store<Data> = Data & SetStore<Data>;

const __DEV__ = process.env.NODE_ENV !== 'production';

const isObj = (val: unknown) =>
  Object.prototype.toString.call(val) === '[object Object]';

const deepClone = (val: unknown) => JSON.parse(JSON.stringify(val));

let run = (fn: VoidFn) => {
  fn();
};

const resso = <Data extends Record<string, unknown>>(
  data: Data,
): Store<Data> => {
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

  const mutableData = deepClone(data);

  Object.keys(data).forEach((key: K) => {
    const initVal = data[key];

    // actions
    if (typeof initVal === 'function') {
      actions[key] = initVal as AnyFn;
      return;
    }

    // state
    const setters = new Set<VoidFn>();

    state[key] = {
      subscribe: (setter) => {
        setters.add(setter);
        return () => setters.delete(setter);
      },
      getSnapshot: () => mutableData[key],
      triggerUpdate: () => setters.forEach((setter) => setter()),
    };
  });

  const setKey = (key: K, val: unknown | KeyUpdater<V>) => {
    if (key in state) {
      const newVal = val instanceof Function ? val(mutableData[key]) : val;
      if (mutableData[key] !== newVal) {
        mutableData[key] = newVal;
        run(() => state[key].triggerUpdate());
      }
      return;
    }

    if (__DEV__ && key in actions) {
      throw new Error(`\`${key as string}\` is an action, can not update`);
    }

    if (__DEV__) {
      throw new Error(`\`${key as string}\` is not initialized in store`);
    }
  };

  return new Proxy(
    Object.assign(() => undefined, mutableData) as Store<Data>,
    {
      get: (_target, key: K) => {
        if (key in actions) {
          return actions[key];
        }

        if (key in state) {
          try {
            return useSyncExternalStore(
              state[key].subscribe,
              state[key].getSnapshot,
              state[key].getSnapshot,
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            return mutableData[key];
          }
        }

        if (__DEV__) {
          throw new Error(`\`${key as string}\` is not initialized in store`);
        }
      },
      set: (_target, key: K, val: V) => {
        setKey(key, val);
        return true;
      },
      apply: (
        _target,
        _thisArg,
        [key, updater]: [K | DataUpdater<Data>, KeyUpdater<V>],
      ) => {
        // store('key', val)
        if (typeof key === 'string') {
          setKey(key, updater);
          return;
        }

        // store({ key: val })
        if (isObj(key)) {
          const newData = key as Data;
          Object.keys(newData).forEach((k) => {
            setKey(k, newData[k]);
          });
          return;
        }

        // store(prev => next)
        if (typeof key === 'function') {
          const newData = key(deepClone(mutableData));
          Object.keys(newData).forEach((k) => {
            setKey(k, newData[k]);
          });
        }
      },
    } as ProxyHandler<Store<Data>>,
  );
};

resso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export default resso;
