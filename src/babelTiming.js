const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const multimatch = require('multimatch');
const PluginsTimer = require('./PluginsTimer');
const renderer = require('./renderer');
const {collectImportsSync} = require('babel-collect-imports');

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function babelTiming(
  file,
  {babelConfig = false, followImports = false, importPatterns} = {}
) {
  let files = [file];

  if (followImports) {
    const {internal, external} = collectImportsSync(file);
    let filesToImport = internal.filter(onlyUnique);

    if (importPatterns) {
      console.log(importPatterns);
      filesToImport = multimatch(filesToImport, importPatterns);
    }

    files = filesToImport;
  }

  files.forEach(file => {
    const timer = new PluginsTimer();

    // https://babeljs.io/docs/en/options#configfile
    babel.transformSync(fs.readFileSync(file).toString(), {
      filename: file,
      configFile: babelConfig ? path.join(process.cwd(), babelConfig) : false,
      minified: true,
      compact: true,
      wrapPluginVisitorMethod: timer.wrapPluginVisitorMethod,
    });

    // @TODO run a single renderer collecting all gathered data
    renderer({
      name: file,
      data: timer.getResults(),
    });
  });
}

module.exports = babelTiming;
