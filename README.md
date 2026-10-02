<div align="center">

Link in bio to **widgets**,
your online **home screen**. ➫ [🔗 kee.so](https://kee.so/)

</div>

---

<div align="center">
<h1>🪢 resso</h1>

The simplest React state manager. _Auto on-demand re-render ⚡️_

**R**eactive **E**legant **S**hared **S**tore **O**bject

(Support React 18, React Native, SSR, Mini Apps)

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nanxiaobei/resso/test.yml?branch=main&style=flat-square)](https://github.com/nanxiaobei/resso/actions/workflows/test.yml)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/resso?style=flat-square)](https://bundlephobia.com/result?p=resso)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/src/index.ts)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/resso?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/LICENSE)

English · [简体中文](./README.zh-CN.md)

</div>

> [!NOTE]
> **Breaking change in v0.26.0 (to better fit AI & React Compiler)**:  
> In React components, always use `const { count } = store.useStore()` to get state.  
> Direct access `store.count` or `const { count } = store` is now for pure data reads.

## Introduction

[resso, world’s simplest React state manager →](https://nanxiaobei.medium.com/resso-worlds-simplest-react-state-manager-a3b1b0ccaa99)

## Features

- Extremely simple 🪩
- Extremely smart 🫙
- Extremely small 🫧

## Demo

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

## Install

```sh
bun add resso
#
pnpm add resso
#
yarn add resso
#
npm i resso
```

## Usage

```jsx
import resso from 'resso';

const store = resso({
  count: 0,
  text: 'hello',
  inc() {
    store.count += 1;
  },
});

function App() {
  const { count, inc } = store.useStore();

  return (
    <>
      {count}
      <button onClick={inc}>+</button>
      <button onClick={() => (store.count -= 1)}>-</button>
    </>
  );
}
```

## API

**Get**

```jsx
// Get state, in component
const { count } = store.useStore();

// Read state, in method
function doSomething() {
  const total = store.count * 2;
  const filtered = store.list.filter((item) => item.name !== '');
  // ...
}
```

**Set (triggers re-render)**

```jsx
// Single
store.count = 60;
store('count', (c) => c + 1);

// Multiple
store({
  count: 60,
  text: 'world',
});

store((s) => ({
  count: s.count + 1,
  text: s.text === 'hello' ? 'world' : 'hello',
}));
```

**Non-state shared vars (Refs)**

Actually, it's not related to resso, it's just JavaScript. You can do it like this:

```jsx
// store.js
export const refs = {
  total: 0,
};

// App.js
import store, { refs } from './store';

function App() {
  refs.total = 100;
  return <div />;
}
```

---

**\* `react<18` batch update**

```jsx
resso.config({ batch: ReactDOM.unstable_batchedUpdates }); // at app entry
```

## Re-render on demand

```jsx
// No `text` update, no re-render
function Text() {
  const { text } = store.useStore();
  return <p>{text}</p>;
}

// Only `count` update triggers re-render
function Count() {
  const { count } = store.useStore();
  return <p>{count}</p>;
}

// No state in UI, no re-render
function Control() {
  return (
    <>
      <button onClick={store.inc}>+</button>
      <button onClick={() => (store.count -= 1)}>-</button>
    </>
  );
}
```

## License

[MIT License](https://github.com/nanxiaobei/resso/blob/main/LICENSE) (c) [nanxiaobei](https://lee.so/)
