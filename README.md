<div align="center">
<h1>🪢 resso</h1>

Reactive shared store of React

No extra re-render, extremely simple!

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nanxiaobei/resso/Test?style=flat-square)](https://github.com/nanxiaobei/resso/actions?query=workflow%3ATest)
[![Codecov](https://img.shields.io/codecov/c/github/nanxiaobei/resso?style=flat-square)](https://codecov.io/gh/nanxiaobei/resso)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/resso?style=flat-square)](https://bundlephobia.com/result?p=resso)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/src/index.ts)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/resso?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/LICENSE)

English · [简体中文](./README.zh-CN.md)

</div>

---

## Install

```sh
yarn add resso

# npm i resso
```

## Usage

```jsx
import resso from 'resso';

const snap = resso({ count: 0, text: 'hello' });

function App() {
  return (
    <>
      {snap.count}
      <button onClick={() => snap.count++}>+</button>
    </>
  );
}
```

## Re-render

```jsx
const snap = resso({
  count: 0,
  text: 'hello',
  inc: () => snap.count++,
});

// No text update, no re-render
function Text() {
  return <p>{snap.text}</p>;
}

// Only count update, re-render
function Count() {
  return <p>{snap.count}</p>;
}

// No count in view, no re-render
function Control() {
  return (
    <>
      <button onClick={snap.inc}>+</button>
      <button onClick={() => snap.count--}>-</button>
    </>
  );
}
```

## Demo

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

## API

```js
import resso from 'resso';

const snap = resso({ count: 0, inc: () => snap.count++ });
```

## License

[MIT License](https://github.com/nanxiaobei/resso/blob/main/LICENSE) (c) [nanxiaobei](https://lee.so/)

## FUTAKE

Try [**FUTAKE**](https://sotake.com/f) in WeChat. A mini app for your inspiration moments. 🌈

![FUTAKE](https://s3.jpg.cm/2021/09/21/IFG3wi.png)
