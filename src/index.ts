import { useState, useEffect, useMemo, useRef } from 'react';

export type Money = { [key: string]: any };
type Updater = (key: string) => void;
type UseResso = (money: Money) => Money;
type Handler = { get: (t: any, k: string) => any; set: (t: any, k: string, v: any) => true };

const __DEV__ = process.env.NODE_ENV !== 'production';
const NOOP = () => () => {};
const ERR_MONEY = 'money should be an object';
const notObj = (val: any) => Object.prototype.toString.call(val) !== '[object Object]';

const map: WeakMap<Money, Updater[]> = new WeakMap();

const useResso: UseResso = (money) => {
  if (__DEV__ && notObj(money)) throw new Error(ERR_MONEY);

  const [, setState] = useState(false);
  const onEffect = useRef(NOOP);

  const cash = useMemo(() => {
    const updaters: Updater[] = map.get(money) || [];
    if (updaters.length === 0) map.set(money, updaters);

    const target: Money = {};
    const handler: Handler = {
      get: (_, key) => {
        if (!target[key]) target[key] = true;
        return money[key];
      },
      set: (_, key, val) => {
        money[key] = val;
        for (let i = 0; i < updaters.length; i++) updaters[i](key);
        return true;
      },
    };

    onEffect.current = () => {
      handler.get = (_, key) => money[key];
      const updater: Updater = (key) => target[key] && setState((s) => !s);
      updaters.push(updater);
      return () => updaters.splice(updaters.indexOf(updater), 1);
    };

    return new Proxy(target, handler);
  }, [money]);

  useEffect(() => onEffect.current(), []);
  return cash;
};

export default useResso;
