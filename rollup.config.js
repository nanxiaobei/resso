import babel from 'rollup-plugin-babel';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const input = 'src/index.ts';
const deps = Object.keys(pkg.peerDependencies);
const external = (id) => deps.includes(id) || id.includes('@babel/runtime/');
const plugins = (useESModules) => [
  babel({
    extensions: ['.ts'],
    plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
    runtimeHelpers: true,
  }),
];

export default [
  {
    input,
    output: { file: pkg.main, format: 'cjs', exports: 'auto' },
    external,
    plugins: plugins(false),
  },
  { input, output: { file: pkg.module, format: 'es' }, external, plugins: plugins(true) },
  { input, output: { file: pkg.types, format: 'es' }, plugins: [dts()] },
];
