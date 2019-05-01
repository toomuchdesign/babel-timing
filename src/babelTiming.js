const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const multimatch = require('multimatch');
const flatten = require('reduce-flatten');
const {collectImportsSync} = require('babel-collect-imports');
const {globPatternsToPaths, onlyUnique} = require('./utils');
const PluginsTimer = require('./PluginsTimer');
const renderer = require('./renderer');

async function babelTiming(
  filePatterns = [],
  {
    babelConfig = false,
    followImports = false,
    importPatterns,
    output = 'return',
  } = {}
) {
  let files = globPatternsToPaths(filePatterns);

  // Follow and recursively resolve all relative imports
  if (followImports) {
    let importedFiles = files
      .map(file => {
        const {internal, external} = collectImportsSync(file);
        return internal;
      })
      .reduce(flatten, [])
      .filter(onlyUnique);

    if (importPatterns) {
      importedFiles = multimatch(importedFiles, importPatterns);
    }
    files = importedFiles;
  }

  const results = files
    .map(file => {
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

      const data = timer.getResults();

      return {
        name: file,
        totalTime: PluginsTimer.getTotalTime(data),
        data,
      };
    })
    .sort((a, b) => {
      if (a.totalTime < b.totalTime) return 1;
      if (a.totalTime > b.totalTime) return -1;
      return 0;
    });

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
