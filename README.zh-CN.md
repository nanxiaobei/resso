<div align="center">
<h1>🪢 resso</h1>

世界上最简单的 React 状态管理器

---

**Re**active **s**hared **s**tore **o**f React. 完全按需 re-render

(支持 React 18、React Native、SSR、小程序)

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nanxiaobei/resso/test.yml?branch=main&style=flat-square)](https://github.com/nanxiaobei/resso/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/nanxiaobei/resso?style=flat-square)](https://codecov.io/gh/nanxiaobei/resso)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/resso?style=flat-square)](https://bundlephobia.com/result?p=resso)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/src/index.ts)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/resso?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/LICENSE)

[English](./README.md) · 简体中文

</div>

---

## 介绍

[resso，世界上最简单的 React 状态管理器 →](https://zhuanlan.zhihu.com/p/468417292)

## 特性

- 非常简单 🪩
- 非常聪明 🫙
- 非常小巧 🫧

## 安装

```sh
pnpm add resso
# or
yarn add resso
# or
npm i resso
```

## 使用

```jsx
import resso from 'resso';

const store = resso({ count: 0, text: 'hello' });

function App() {
  const { count } = store; // 在顶层先解构 🥷
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

```js
import resso from 'resso';

const store = resso({
  count: 0,
  inc: async () => {
    const { count } = store; // 在顶层先解构，同样 🥷

    store.count = count + 1; // 直接赋值
    store('count', (prev) => prev + 1); // 或使用更新函数
  },
});

// store 数据其实是以 useState 注入组件，所以请确保在组件
// 最顶层 (Hooks rules) 先解构再使用，否则将有 React 报错
function App() {
  const { count, inc } = store;
  // 其它组件代码写在下面 ...
}

// 对于 react<18，实现批量更新：
// resso.config({ batch: ReactDOM.unstable_batchedUpdates }); // 在 app 入口处
```

## 按需 re-render

```jsx
const store = resso({
  count: 0,
  text: 'hello',
  inc: () => store.count++,
});

// 无 text 更新，无 re-render
function Text() {
  const { text } = store;
  return <p>{text}</p>;
}

// 只在 count 更新时，re-render
function Count() {
  const { count } = store;
  return <p>{count}</p>;
}

// 无数据在视图中，无 re-render
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

## 协议

[MIT License](https://github.com/nanxiaobei/resso/blob/main/LICENSE) (c) [nanxiaobei](https://lee.so/)

## FUTAKE

试试 [**FUTAKE**](https://sotake.com/f) 小程序，你的灵感相册。🌈

![](https://s3.bmp.ovh/imgs/2022/07/21/452dd47aeb790abd.png)
