const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const {onlyUnique} = require('./utils');

async function getImports(file, options) {
  // https://rollupjs.org/guide/en#rollup-rollup
  const inputOptions = {
    external: [],
    input: file,
    plugins: [
      nodeResolve({
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.json'],
        mainFields: options.resolveMainFields,
      }),
      commonjs({
        include: options.include,
        exclude: options.exclude,
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.json'],
        sourceMap: false,
      }),
    ],
    onwarn: options.verbose ? undefined : () => {},
  };

  const bundle = await rollup.rollup(inputOptions);
  const imports = bundle.watchFiles
    .filter(file => file.startsWith('/'))
    .filter(onlyUnique);
  return imports;
}

module.exports = getImports;
