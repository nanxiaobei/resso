<div align="center">
<h1>🪢 resso</h1>

World's Simplest React State Manager

(React 18, React Native, SSR, Mini Apps)

**Re**active **s**hared **s**tore **o**f React. No more extra re-render

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nanxiaobei/resso/Test?style=flat-square)](https://github.com/nanxiaobei/resso/actions?query=workflow%3ATest)
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
yarn add resso

# npm i resso
```

## Usage

```jsx
import resso from 'resso';

const store = resso({ count: 0, text: 'hello' });

function App() {
  const { count } = store; // destructure at top first 🥷
  return (
    <>
      {count}
      <button onClick={() => store.count++}>+</button>
    </>
  );
}
```

## Demo

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

## API

```js
import resso from 'resso';

const store = resso({
  count: 0,
  incAsync: async () => {
    const { count } = store; // if need to get state in async functions, please at top
    // `await` or `then()` below ...

    store.count = 1; // directly assign
    store('count', (prev) => prev + 1); // or use updater funtion
  },
});

// store data are injected by useState, so please ensure to destructure first,
// top level in a component (Hooks rules), then use, or may get React warning
function App() {
  const { count, incAsync } = store;
  // other component code below ...
}

// For `react<=17`, use batch updating in async updates:
// resso.config({ batch: ReactDOM.unstable_batchedUpdates }); // at app entry
```

## Re-render

```jsx
const store = resso({
  count: 0,
  text: 'hello',
  inc: () => store.count++,
});

// No text update, no re-render
function Text() {
  const { text } = store;
  return <p>{text}</p>;
}

// Only count update, re-render
function Count() {
  const { count } = store;
  return <p>{count}</p>;
}

// No data in view, no re-render
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

Try [**FUTAKE**](https://sotake.com/f) in WeChat. A mini app for your inspiration moments. 🌈

![](https://s3.bmp.ovh/imgs/2022/07/21/452dd47aeb790abd.png)
