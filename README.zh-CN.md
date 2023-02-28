<div align="center">
<h1>〄 resso</h1>

最简单的 React 状态管理器

_自动按需 re-render ⚡️_

---

**R**eactive **E**legant **S**hared **S**tore **O**bject

(支持 React 18、React Native、SSR、小程序等)

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
  const { count } = store; // 必须在顶层先解构 🥷
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

**初始化**

```jsx
import resso from 'resso';

const store = resso({
  count: 0,
  inc: () => {
    const { count } = store; // 必须在顶层先解构，同样 🥷
  },
});
```

**更新**

```jsx
// 更新单个 → 直接赋值
store.count = count + 1;

// 更新单个 → 更新函数
store('count', (prev) => prev + 1);

// 更新多个
Object.assign(store, { a, b, c });
```

**使用**

```jsx
// 确保在最顶层先解构，因为数据是以 useState 注入 (Hooks 规则)
function App() {
  const { count, inc } = store; // 必须在最顶部，否则将有 React 报错
}
```

---

**\* react<18 批量更新**

```jsx
// 在 react<18 时使用批量更新：
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

// 没有数据用在 jsx 中，绝不 re-render
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

试试 [**FUTAKE**](https://sotake.com/futake) 小程序，你的灵感相册。🌈

![](https://s3.bmp.ovh/imgs/2022/07/21/452dd47aeb790abd.png)
