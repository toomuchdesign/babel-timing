const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const multimatch = require('multimatch');
const flatten = require('reduce-flatten');
const {globPatternsToPaths, onlyUnique} = require('./utils');
const PluginsTimer = require('./PluginsTimer');
const getImports = require('./getImports');
const render = require('./render');

async function babelTiming(
  filePatterns = [],
  {
    babelConfig,
    followImports = false,
    include = ['**'],
    exclude = ['**/node_modules/**'],
    resolveMainFields = ['browser', 'module', 'main'],
    expandPackages = false,
    output,
    outputPath,
    verbose = false,
  } = {}
) {
  let files = globPatternsToPaths(filePatterns);

  // Follow and recursively resolve all relative imports
  if (followImports) {
    let importedFiles = await Promise.all(
      files.map(file =>
        getImports(file, {
          babelConfig,
          resolveMainFields,
          include,
          exclude,
          verbose,
        })
      )
    );

    importedFiles = importedFiles.reduce(flatten, []).filter(onlyUnique);
    files = importedFiles;
  }

  // All file paths absolute
  files = files.map(file => path.resolve(file));

  if (Array.isArray(include)) {
    files = multimatch(files, include);
  }

  if (Array.isArray(exclude)) {
    const negatedExclude = exclude.map(pattern => `!${pattern}`);
    files = multimatch(files, ['**', ...negatedExclude]);
  }

  let results = files.map(file => {
    const timer = new PluginsTimer(file);

    /*
     * Transform all gathered files one by one and collect
     * transform meta data using `wrapPluginVisitorMethod`
     * https://babeljs.io/docs/en/options#configfile
     */
    babel.transformSync(fs.readFileSync(file).toString(), {
      filename: file,
      configFile: babelConfig ? path.join(process.cwd(), babelConfig) : false,
      minified: true,
      compact: true,
      wrapPluginVisitorMethod: timer.wrapPluginVisitorMethod,
    });

    return timer.getResults();
  });

  return render(results, {expandPackages, output, outputPath});
}

module.exports = babelTiming;
