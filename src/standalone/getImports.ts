import webpack from 'webpack';
import path from 'path';
import multimatch from 'multimatch';
import minimatch from 'minimatch';
import rimraf from 'rimraf';
import findCacheDir from 'find-cache-dir';
import findBabelConfig from 'find-babel-config';
import { onlyUnique } from '../utils';
import { OptionsWithDefaults } from '../types';

function runWebpack(config: webpack.Configuration): Promise<webpack.Stats> {
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

function extractPathFromIdentifier(sourceName: string) {
  const path = sourceName.split('!').pop();
  return path || sourceName;
}

function getOutputPath() {
  return findCacheDir({ name: 'babel-timing' });
}

function hasExtension(name: string) {
  const lastPathPart = name.split('/').pop();
  if (!lastPathPart) {
    return false;
  }
  return lastPathPart.includes('.', 1);
}

export default async function getImports(
  file: string,
  options: OptionsWithDefaults
) {
  const config = getConfig(file, options);
  const stats = await runWebpack(config);

  if (stats.hasErrors()) {
    throw new Error(stats.toString('minimal'));
  }

  const outputPath = getOutputPath();
  if (outputPath) {
    rimraf(outputPath, () => {});
  }

  // https://webpack.js.org/api/stats/#root
  const importedModules = stats.toJson('normal').modules || [];
  const imports: string[] = importedModules
    .map(module => {
      if (module.modules) {
        return module.modules.map(module => module.identifier);
      } else {
        return [module.identifier];
      }
    })
    .flat()
    .filter(identifier => identifier.startsWith('/'))
    .map(extractPathFromIdentifier)
    .filter(onlyUnique);

  return imports;
}

function getConfig(
  file: string,
  options: OptionsWithDefaults
): webpack.Configuration {
  const babelConfig =
    options.babelConfig || findBabelConfig.sync(path.dirname(file)).file;

  const BABEL_TIMING_FILE_EXTENSIONS_REGEX = new RegExp(
    `(${options.resolveExtensions.join('|')})$`
  );

  const config: webpack.Configuration = {
    mode: 'production',
    target: 'node',
    entry: path.resolve(file),
    output: {
      path: getOutputPath(),
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
          include: options.include.map(path => minimatch.makeRe(path)),
          exclude: options.exclude.map(path => minimatch.makeRe(path)),
          use: {
            loader: require.resolve('babel-loader', { paths: [__dirname] }),
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
        checkResource(resource: string) {
          // Exclude files with unexpected extensions (!options.resolveExtensions)
          // @NOTE It breaks when filename has dots
          if (hasExtension(resource)) {
            return BABEL_TIMING_FILE_EXTENSIONS_REGEX.test(resource) === false;
          }

          // Ignore excluded files
          const resourcePath = resource.startsWith('.')
            ? resource
            : require.resolve(resource, { paths: [process.cwd()] });

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
