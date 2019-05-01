const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const {onlyUnique} = require('./utils');

async function getImports(file) {
  // https://rollupjs.org/guide/en#rollup-rollup
  const inputOptions = {
    external: [],
    input: file,
    plugins: [
      nodeResolve({
        mainFields: ['browser', 'module', 'main'],
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.json'],
      }),
      commonjs({
        include: '**',
        // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.json'],
        sourceMap: false,
      }),
    ],
  };

  const bundle = await rollup.rollup(inputOptions);
  const imports = bundle.watchFiles
    .filter(file => file.startsWith('/'))
    .filter(onlyUnique);
  return imports;
}

module.exports = getImports;
