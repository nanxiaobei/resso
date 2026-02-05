import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const input = 'src/index.ts';
const cjsOutput = { file: pkg.main, format: 'cjs', exports: 'auto' } as const;
const esmOutput = { file: pkg.module, format: 'es' } as const;
const dtsOutput = { file: pkg.types, format: 'es' } as const;

const cjsTsPlugin = typescript({ compilerOptions: { module: 'nodenext' } });
const esmTsPlugin = typescript({ compilerOptions: { module: 'esnext' } });

export default [
  { input, output: cjsOutput, plugins: [cjsTsPlugin], external: () => true },
  { input, output: esmOutput, plugins: [esmTsPlugin], external: () => true },
  { input, output: dtsOutput, plugins: [dts()] },
];
