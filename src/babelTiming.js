const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const PluginsTimer = require('./PluginsTimer');
const renderer = require('./renderer');

function babelTiming(file, {babelConfig = false} = {}) {
  const timer = new PluginsTimer();

  // https://babeljs.io/docs/en/options#configfile
  babel.transformSync(fs.readFileSync(file).toString(), {
    filename: file,
    configFile: babelConfig ? path.join(process.cwd(), babelConfig) : false,
    minified: true,
    compact: true,
    wrapPluginVisitorMethod: timer.wrapPluginVisitorMethod,
  });

  renderer({
    name: file,
    data: timer.getResults(),
  });
}

module.exports = babelTiming;
