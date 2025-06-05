import { useSyncExternalStore } from 'use-sync-external-store/shim';

type VoidFn = () => void;
type AnyFn = (...args: unknown[]) => unknown;

type KeyUpdater<V> = V | ((val: V) => V);
type ObjUpdater<Obj> = (obj: Obj) => Partial<Obj>;

type SetStore<Obj> = {
  <K extends keyof Obj>(key: K, updater: KeyUpdater<Obj[K]>): void;
  (obj: Partial<Obj>): void;
  (updater: ObjUpdater<Obj>): void;
};

type Store<Obj> = Obj & SetStore<Obj>;

const __DEV__ = process.env.NODE_ENV !== 'production';

const isObj = (val: unknown) => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

let run = (fn: VoidFn) => {
  fn();
};

const resso = <Obj extends Record<string, unknown>>(obj: Obj): Store<Obj> => {
  type K = keyof Obj;
  type V = Obj[K];
  type Actions = Record<K, AnyFn>;

  type State = Record<
    K,
    {
      subscribe: (setter: VoidFn) => VoidFn;
      getSnapshot: () => Obj[K];
      triggerUpdate: () => void;
    }
  >;

  if (__DEV__ && !isObj(obj)) {
    throw new Error('object required');
  }

  const state: State = {} as State;
  const actions: Actions = {} as Actions;

  Object.keys(obj).forEach((key: K) => {
    const initVal = obj[key];

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
      getSnapshot: () => obj[key],
      triggerUpdate: () => setters.forEach((setter) => setter()),
    };
  });

  const setKey = (key: K, val: unknown | KeyUpdater<V>) => {
    if (key in obj) {
      if (key in state) {
        const newVal = val instanceof Function ? val(obj[key]) : val;
        if (obj[key] !== newVal) {
          obj[key] = newVal;
          run(() => state[key].triggerUpdate());
        }
      } else if (__DEV__) {
        throw new Error(`\`${key as string}\` is an action, can not update`);
      }
    } else if (__DEV__) {
      throw new Error(`\`${key as string}\` is not initialized in store`);
    }
  };

  return new Proxy(
    Object.assign(() => undefined, obj) as Store<Obj>,
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
            return obj[key];
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
        [key, updater]: [K | Obj | ObjUpdater<Obj>, KeyUpdater<V>],
      ) => {
        // store('key', val)
        if (typeof key === 'string') {
          setKey(key, updater);
          return;
        }

        // store({ key: val })
        if (isObj(key)) {
          const newObj = key as Obj;
          Object.keys(newObj).forEach((k) => {
            setKey(k, newObj[k]);
          });
          return;
        }

        // store(prev => next)
        if (typeof key === 'function') {
          const newObj = key(JSON.parse(JSON.stringify(obj)));
          Object.keys(newObj).forEach((k) => {
            setKey(k, newObj[k]);
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
