import babel from 'rollup-plugin-babel';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const input = 'src/index.ts';
const peer = Object.keys(pkg.peerDependencies);
const external = (id) => peer.includes(id);
const plugins = [babel({ extensions: ['.ts'] })];

export default [
  { input, output: { file: pkg.main, format: 'cjs', exports: 'auto' }, external, plugins },
  { input, output: { file: pkg.module, format: 'es' }, external, plugins },
  { input, output: { file: pkg.types, format: 'es' }, plugins: [dts()] },
];
