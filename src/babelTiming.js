const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const multimatch = require('multimatch');
const flatten = require('reduce-flatten');
const {globPatternsToPaths, onlyUnique, sortByProperty} = require('./utils');
const PluginsTimer = require('./PluginsTimer');
const renderer = require('./renderer');
const getImports = require('./getImports');
const joinSamePackageResults = require('./joinSamePackageResults');

async function babelTiming(
  filePatterns = [],
  {
    babelConfig = false,
    followImports = false,
    include = ['**'],
    exclude = ['**/node_modules/**'],
    resolveMainFields = ['browser', 'module', 'main'],
    expandPackages = false,
    expandPlugins = false,
    output = 'return',
    verbose = false,
  } = {}
) {
  let files = globPatternsToPaths(filePatterns);

  // Follow and recursively resolve all relative imports
  if (followImports) {
    let importedFiles = await Promise.all(
      files.map(file =>
        getImports(file, {resolveMainFields, include, exclude, verbose})
      )
    );

    importedFiles = importedFiles.reduce(flatten, []).filter(onlyUnique);
    files = importedFiles;
  }

  if (Array.isArray(include)) {
    files = multimatch(files, include);
  }

  if (Array.isArray(exclude)) {
    const negatedExclude = exclude.map(pattern => `!${pattern}`);
    files = multimatch(files, ['**', ...negatedExclude]);
  }

  let results = files.map(file => {
    const timer = new PluginsTimer();

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

    return {
      name: file,
      plugins: timer.getResults(),
    };
  });

  if (!expandPackages) {
    results = joinSamePackageResults(results);
  }

  results = results
    .map(entry => ({
      ...entry,
      totalTime: PluginsTimer.getTotalTime(entry.plugins),
    }))
    .sort(sortByProperty('totalTime'));

  if (!expandPlugins) {
    results = results.map(entry => {
      const result = {
        ...entry,
      };
      delete result.plugins;
      return result;
    });
  }

  switch (output) {
    case 'return': {
      return results;
    }
    case 'console': {
      renderer(results);
      return;
    }
    case 'json': {
      fs.writeFileSync(
        path.join(process.cwd(), 'babel-timing-results.json'),
        JSON.stringify(results)
      );
      return;
    }
  }
}

module.exports = babelTiming;
