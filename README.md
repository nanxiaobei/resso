<div align="center">
<h1>〄 resso</h1>

The Simplest React State Manager

_Auto on-demand re-render ⚡️_

---

**R**eactive **E**legant **S**hared **S**tore **O**bject

(Support React 18, React Native, SSR, Mini Apps)

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nanxiaobei/resso/test.yml?branch=main&style=flat-square)](https://github.com/nanxiaobei/resso/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/nanxiaobei/resso?style=flat-square)](https://codecov.io/gh/nanxiaobei/resso)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/resso?style=flat-square)](https://bundlephobia.com/result?p=resso)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/src/index.ts)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/resso?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/LICENSE)

English · [简体中文](./README.zh-CN.md)

</div>

---

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
npm i resso
```

## Usage

```jsx
import resso from 'resso';

const store = resso({ count: 0, text: 'hello' });

function App() {
  const { count } = store; // must destructure at top first 🥷
  return (
    <>
      {count}
      <button onClick={() => store.count++}>+</button>
    </>
  );
}
```

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

## API

**Initialize**

```jsx
import resso from 'resso';

const store = resso({
  count: 0,
  inc: () => {
    const { count } = store; // must destructure at top first, also 🥷
  },
});
```

**Update**

```jsx
// single update → directly assign
store.count = count + 1;

// single update → updater funtion
store('count', (prev) => prev + 1);

// multiple updates
Object.assign(store, { a, b, c });
```

**Use**

```jsx
// ensure to destructure at top first, since data injected by useState (Hooks rules)
function App() {
  const { count, inc } = store; // must at top, or may get React warning
}
```

---

**\* react<18 batch update**

```jsx
// to use batch update when react<18:
resso.config({ batch: ReactDOM.unstable_batchedUpdates }); // at app entry
```

## Re-render on demand

```jsx
// No text update, no re-render
function Text() {
  const { text } = store;
  return <p>{text}</p>;
}

// Only when count updates, re-render
function Count() {
  const { count } = store;
  return <p>{count}</p>;
}

// No data used in jsx, no re-render
function Control() {
  const { inc } = store;
  return (
    <>
      <button onClick={inc}>+</button>
      <button onClick={() => store.count--}>-</button>
    </>
  );
}
```

## License

[MIT License](https://github.com/nanxiaobei/resso/blob/main/LICENSE) (c) [nanxiaobei](https://lee.so/)

## FUTAKE

Try [**FUTAKE**](https://sotake.com/futake) in WeChat. A mini app for your inspiration moments. 🌈

![](https://s3.bmp.ovh/imgs/2022/07/21/452dd47aeb790abd.png)
