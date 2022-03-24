import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const input = 'src/index.ts';
const peer = Object.keys(pkg.peerDependencies);
const external = (id: string) => peer.includes(id);
const plugins = [typescript()];

export default [
  { input, output: { file: pkg.main, format: 'cjs', exports: 'auto' }, external, plugins },
  { input, output: { file: pkg.module, format: 'es' }, external, plugins },
  { input, output: { file: pkg.types, format: 'es' }, plugins: [dts()] },
];
