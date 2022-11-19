import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json') as unknown as string);

const input = 'src/index.ts';
const cjsOutput = { file: pkg.main, format: 'cjs', exports: 'auto' };
const esmOutput = { file: pkg.module, format: 'es' };
const dtsOutput = { file: pkg.types, format: 'es' };
const external = () => true;

export default [
  { input, output: cjsOutput, plugins: [typescript()], external },
  { input, output: esmOutput, plugins: [typescript()], external },
  { input, output: dtsOutput, plugins: [dts()] },
];
