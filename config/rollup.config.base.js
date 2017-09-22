import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {

  input: 'src/index.js',

  output: {
    file: 'dist/redux-cake.js',
    format: 'umd',
    name: 'redux-cake',
  },

  sourcemap: true,

  external: ['redux'],

  globals: { redux: 'redux' },

  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [ 'es2015', { modules: false } ]
      ],
      plugins: [
        'transform-object-rest-spread'
      ]
    })
  ]

};
