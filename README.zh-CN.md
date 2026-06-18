<div align="center">

Link in bio to **widgets**,
your online **home screen**. ➫ [🔗 kee.so](https://kee.so/)

</div>

---

<div align="center">
<h1>🪢 resso</h1>

最简单的 React 状态管理器。_自动按需 re-render ⚡️_

**R**eactive **E**legant **S**hared **S**tore **O**bject

(支持 React 18、React Native、SSR、小程序等)

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nanxiaobei/resso/test.yml?branch=main&style=flat-square)](https://github.com/nanxiaobei/resso/actions/workflows/test.yml)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/resso?style=flat-square)](https://bundlephobia.com/result?p=resso)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/src/index.ts)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/resso?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/LICENSE)

[English](./README.md) · 简体中文

</div>

## 介绍

[resso，世界上最简单的 React 状态管理器 →](https://zhuanlan.zhihu.com/p/468417292)

## 特性

- 非常简单 🪩
- 非常聪明 🫙
- 非常小巧 🫧

## 示例

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

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

const store = resso({
  count: 0,
  text: 'hello',
  inc() {
    store.count += 1;
  },
});

function App() {
  const { count } = store; // 需在顶部解构（组件中）
  // 或
  const { count } = store.useStore(); // hooks 规则，更适配 react compiler

  return (
    <>
      {count}
      <button onClick={() => (store.count += 1)}>+</button>
    </>
  );
}
```

\* 顶部解构其实是调用 `useState`（Hooks 规则，否则将有 React 报错）

## API

**获取 state**

```jsx
const { count } = store; // 需在顶部解构（组件中）
// or
const { count } = store.useStore(); // hooks 规则，更适配 react compiler
```

**更新单个**

```jsx
store.count = 60;

store('count', (c) => c + 1);
```

**更新多个**

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

**非 state 共享变量 (Refs)**

事实上它与 resso 无关，只是 JavaScript。你可以这样做：

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

**\* `react<18` 批量更新**

```jsx
resso.config({ batch: ReactDOM.unstable_batchedUpdates }); // 在项目入口
```

## 按需 re-render

```jsx
// 没有 text 更新，绝不 re-render
function Text() {
  const { text } = store;
  return <p>{text}</p>;
}

// 只在 count 更新时 re-render
function Count() {
  const { count } = store;
  return <p>{count}</p>;
}

// 没有 state 在 UI 中，绝不 re-render
function Control() {
  return (
    <>
      <button onClick={store.inc}>+</button>
      <button onClick={() => (store.count -= 1)}>-</button>
    </>
  );
}
```

## 协议

[MIT License](https://github.com/nanxiaobei/resso/blob/main/LICENSE) (c) [nanxiaobei](https://lee.so/)
