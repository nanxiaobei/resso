import { useState, useEffect, useMemo, useRef } from 'react';

type Noop = () => void;
type State = { [key: string]: any };
type Updater = (key: string) => void;
type Handler = { get?: (t: any, k: string) => any; set: (t: any, k: string, v: any) => true };

const NOOP = () => undefined;
const ERR_STATE = 'state should be an object';
const __DEV__ = process.env.NODE_ENV !== 'production';
const notObj = (val: any) => Object.prototype.toString.call(val) !== '[object Object]';

const resso = (state: State) => {
  if (__DEV__ && notObj(state)) throw new Error(ERR_STATE);
  const updaters: Updater[] = [];

  return () => {
    const [, setState] = useState(false);
    const onMount = useRef<Noop>(NOOP);
    useEffect(() => onMount.current(), []);

    return useMemo(() => {
      const target: State = {};
      const handler: Handler = {
        get: (_, key) => {
          if (!target[key]) target[key] = true;
          return state[key];
        },
        set: (_, key, val) => {
          state[key] = val;
          for (let i = 0; i < updaters.length; i++) updaters[i](key);
          return true;
        },
      };

      onMount.current = () => {
        handler.get = (_, key) => state[key];

        if (Object.keys(target).length > 0) {
          const updater: Updater = (key) => target[key] && setState((s) => !s);
          updaters.push(updater);
          return () => updaters.splice(updaters.indexOf(updater), 1);
        }
      };

      return new Proxy(state, handler);
    }, []);
  };
};

export default resso;
