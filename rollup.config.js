import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'HSXKPasswd'
    },
    {
      file: 'dist/index.es.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonjs()
  ]
};