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

## Introduction

[resso, world’s simplest React state manager →](https://nanxiaobei.medium.com/resso-worlds-simplest-react-state-manager-a3b1b0ccaa99)

## Features

- Extremely simple 🪩
- Extremely smart 🫙
- Extremely small 🫧

## Install

```sh
pnpm add resso
# or
yarn add resso
# or
bun add resso
# or
npm i resso
```

## Usage

```jsx
import resso from 'resso';

const store = resso({
  count: 0,
  text: 'hello',
  inc() {
    const { count } = store; // must destructure at top (if use in method)
    store.count = count + 1;
  },
});

function App() {
  const { count } = store; // must destructure at top (if use in UI)

  return (
    <>
      {count}
      <button onClick={() => (store.count += 1)}>+</button>
    </>
  );
}
```

\* destructure at top is calling `useState` (Hooks rules, or may get React error)

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

## API

**Single update**

```jsx
store.count = 60;

store('count', (c) => c + 1);
```

**Multiple update**

```jsx
store({
  count: 60,
  text: 'world',
});

store((s) => ({
  count: s.count + 1,
  text: s.text === 'hello' ? 'world' : 'hello',
}));
```

**None-state variables (Refs)**

Actually it's not related to resso, it's just JavaScript. You can do it like this:

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
// no text update, no re-render
function Text() {
  const { text } = store;
  return <p>{text}</p>;
}

// only when count updates, re-render
function Count() {
  const { count } = store;
  return <p>{count}</p>;
}

// no state in UI, no re-render
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
