<div align="center">

Link in bio to **widgets**,
your online **home screen**. ➫ [🔗 kee.so](https://kee.so/)

</div>

---

<div align="center">
<h1>🪢 resso</h1>

最简单的 React 状态管理器。_自动处理仅按需 re-render。_

**R**eactive **E**legant **S**hared **S**tore **O**bject

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nanxiaobei/resso/test.yml?branch=main&style=flat-square)](https://github.com/nanxiaobei/resso/actions/workflows/test.yml)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/resso?style=flat-square)](https://bundlephobia.com/result?p=resso)
[![React](https://img.shields.io/badge/react-%3E%3D18-blue?style=flat-square)](https://react.dev/)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/src/index.ts)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/resso?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/LICENSE)

[English](./README.md) · 简体中文

</div>

> [!NOTE]
> **自 v0.26.0 Breaking Change（为了更好地适配 AI 与 React Compiler）**：  
> 在 React 组件中，始终使用 `const { count } = store.useStore()` 获取 state。  
> 直接访问 `store.count` 或 `const { count } = store` 现用于纯数据读取。

## 介绍

[resso，世界上最简单的 React 状态管理器 →](https://zhuanlan.zhihu.com/p/468417292)

## 特性

- 极其简单
- 极其聪明
- 极其小巧

## 示例

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

## 安装

```sh
bun add resso
#
pnpm add resso
#
yarn add resso
#
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
// 获取 state，在组件中
const { count } = store.useStore();

// 读取 state，在方法中
function doSomething() {
  const total = store.count * 2;
  const filtered = store.list.filter((item) => item.name !== '');
  // ...
}
```

**Set（触发 re-render）**

```jsx
// 单个
store.count = 60;
store('count', (c) => c + 1);

// 多个
store({
  count: 60,
  text: 'world',
});

store((s) => ({
  count: s.count + 1,
  text: s.text === 'hello' ? 'world' : 'hello',
}));
```

## 共享 Refs

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

## 按需 Re-render

```jsx
// 无 `text` 更新，不 re-render
function Text() {
  const { text } = store.useStore();
  return <p>{text}</p>;
}

// 仅 `count` 更新触发 re-render
function Count() {
  const { count } = store.useStore();
  return <p>{count}</p>;
}

// UI 中无 state，不 re-render
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
