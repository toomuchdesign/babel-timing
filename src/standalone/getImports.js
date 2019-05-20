const path = require('path');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const findBabelConfig = require('find-babel-config');
const {onlyUnique} = require('../utils');
const defaultExtensions = ['.js', '.jsx', '.mjs', '.ts', '.json'];

/*
 * @NOTE Even though we only need to discover the import tree of the
 * provided file, we still have to transpile in case files syntax
 * prevent Rollup from parsing
 *
 * @TODO consider using Rollup to run "wrapPluginVisitorMethod" method
 */
async function getImports(file, options) {
  // Even though rollup-plugin-babel can autodiscover Babel configurations,
  // here we want to use the same babel config for every module
  const babelConfig =
    options.babelConfig || findBabelConfig.sync(path.dirname(file)).file;

  // https://rollupjs.org/guide/en#rollup-rollup
  const inputOptions = {
    external: [],
    input: file,
    plugins: [
      nodeResolve({
        extensions: defaultExtensions,
        mainFields: options.resolveMainFields,
      }),
      babel({
        include: options.include,
        exclude: options.exclude,
        extensions: defaultExtensions,
        configFile: babelConfig,
      }),
      commonjs({
        include: options.include,
        exclude: options.exclude,
        extensions: defaultExtensions,
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
