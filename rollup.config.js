import commonjs from '@rollup/plugin-commonjs';
import multiInput from 'rollup-plugin-multi-input';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: [
      'src/**/*.(ts|tsx)',
    ],
    plugins: [
      multiInput(),
      commonjs(),
      resolve({
        resolveOnly: [
          'src',
          /fp-ts/,
        ]
      }),

      typescript(),
      terser(),
    ],
    external: [],
    output: [
      {
        dir: 'dist',
        format: 'cjs',
      },
      {
        dir: 'esm',
        format: 'es',
      },
    ],
  },
];
