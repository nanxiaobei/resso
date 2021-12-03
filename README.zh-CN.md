<div align="center">
<h1>🪢 resso</h1>

React 响应式共享 state

简单，简单，简单

[![npm](https://img.shields.io/npm/v/resso?style=flat-square)](https://www.npmjs.com/package/resso)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nanxiaobei/resso/Test?style=flat-square)](https://github.com/nanxiaobei/resso/actions?query=workflow%3ATest)
[![Codecov](https://img.shields.io/codecov/c/github/nanxiaobei/resso?style=flat-square)](https://codecov.io/gh/nanxiaobei/resso)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/resso?style=flat-square)](https://bundlephobia.com/result?p=resso)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/src/index.ts)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/resso?style=flat-square)](https://github.com/nanxiaobei/resso/blob/main/LICENSE)

[English](./README.md) · 简体中文

</div>

---

## 安装

```sh
yarn add resso

# npm i resso
```

## 使用

```jsx
import resso from 'resso';

const useCounter = resso({
  text: 'hi, 🪢 resso',
  count: 0,
});

// 无 state.text 更新，无 re-render
function Text() {
  const state = useCounter();
  return <p>{state.text}</p>;
}

// 只在 state.count 更新时，re-render
function Count() {
  const state = useCounter();
  return <p>{state.count}</p>;
}

// 无 state.count 在视图中，无 re-render
function Control() {
  const state = useCounter();
  return <button onClick={() => state.count++}>+</button>;
}

function App() {
  return (
    <>
      <Text />
      <Count />
      <Control />
    </>
  );
}
```

## 示例

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn?file=/src/App.jsx)

## API

```js
import resso from 'resso';

const useShared = resso({ key: 'value' });
```

## 协议

[MIT License](https://github.com/nanxiaobei/resso/blob/main/LICENSE) (c) [nanxiaobei](https://lee.so/)

## FUTAKE

试试 [**FUTAKE**](https://sotake.com/f) 小程序，你的灵感相册。🌈

![FUTAKE](https://s3.jpg.cm/2021/09/21/IFG3wi.png)
