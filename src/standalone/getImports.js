let webpack = require('webpack');
let path = require('path');
const multimatch = require('multimatch');
const minimatch = require('minimatch');
const rimraf = require('rimraf');
const flatten = require('reduce-flatten');
const findCacheDir = require('find-cache-dir');
const findBabelConfig = require('find-babel-config');
const {onlyUnique} = require('../utils.ts');

function runWebpack(config) {
  return new Promise((resolve, reject) => {
    let compiler = webpack(config);
    compiler.run((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function extractPathFromIdentifier(sourceName) {
  return sourceName.split('!').pop();
}

function getOutptPath() {
  return findCacheDir({name: 'babel-timing'});
}

function hasExtension(name) {
  const lastPathPart = name.split('/').pop();
  return lastPathPart.includes('.', 1);
}

async function getImports(file, options) {
  const config = getConfig(file, options);
  const stats = await runWebpack(config);

  if (stats.hasErrors()) {
    throw new Error(stats.toString('minimal'));
  }

  rimraf(getOutptPath(), () => {});

  // https://webpack.js.org/api/stats/#root
  const imports = stats
    .toJson('normal')
    .modules.map(module => {
      if (module.modules) {
        return module.modules.map(module => module.identifier);
      } else {
        return [module.identifier];
      }
    })
    .reduce(flatten)
    .filter(identifier => identifier.startsWith('/'))
    .map(extractPathFromIdentifier)
    .filter(onlyUnique);

  return imports;
}

function getConfig(file, options) {
  const babelConfig =
    options.babelConfig || findBabelConfig.sync(path.dirname(file)).file;

  const BABEL_TIMING_FILE_EXTENSIONS_REGEX = new RegExp(
    `(${options.resolveExtensions.join('|')})$`
  );

  const config = {
    mode: 'production',
    target: 'node',
    entry: path.resolve(file),
    output: {
      path: getOutptPath(),
    },
    resolve: {
      modules: [path.join(process.cwd(), 'node_modules')],
      mainFields: options.resolveMainFields,
      extensions: options.resolveExtensions,
    },
    module: {
      rules: [
        {
          test: BABEL_TIMING_FILE_EXTENSIONS_REGEX,
          include: options.include.map(minimatch.makeRe),
          exclude: options.exclude.map(minimatch.makeRe),
          use: {
            loader: require.resolve('babel-loader', {paths: __dirname}),
            options: {
              configFile: babelConfig,
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.IgnorePlugin({
        // @TODO build actual absolute resource path
        checkResource(resource, context) {
          // Exclude files with unexpected extensions (!options.resolveExtensions)
          // @NOTE It breaks when filename has dots
          if (hasExtension(resource)) {
            return BABEL_TIMING_FILE_EXTENSIONS_REGEX.test(resource) === false;
          }

          // Ignore excluded files
          const resourcePath = resource.startsWith('.')
            ? resource
            : require.resolve(resource, {paths: [process.cwd()]});

          if (multimatch([resourcePath], options.exclude).length > 0) {
            return true;
          }

          return false;
        },
      }),
    ],
  };

  return config;
}

module.exports = getImports;
