<div align="center">
<h1>resso</h1>

Reactive Shared State for React

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

const useCounter = resso({ count: 0 });

function Counter() {
  const state = useCounter();

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => state.count++}>+</button>
    </>
  );
}
```

## Demo

[![Edit resso](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/resso-ol8dn)

## API

```js
import resso from 'resso';

const useStore = resso({ count: 0 });

const state = useStore();
```

## License

[MIT License](https://github.com/nanxiaobei/resso/blob/main/LICENSE) (c) [nanxiaobei](https://lee.so/)

## FUTAKE

Try [**FUTAKE**](https://sotake.com/f) in WeChat. A mini app for your inspiration moments. 🌈

![FUTAKE](https://s3.jpg.cm/2021/09/21/IFG3wi.png)
