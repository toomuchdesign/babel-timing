const render = require('../src/render');
const PluginsTimer = require('../src/PluginsTimer');
let timers = [];

// https://github.com/babel/babel-loader#example
const babelTimingLoader = require('babel-loader').custom(() => {
  return {
    // Babel's 'PartialConfig' object.
    config(cfg) {
      const timer = new PluginsTimer(cfg.options.filename);
      timers.push(timer);
      return {
        ...cfg.options,
        wrapPluginVisitorMethod: timer.wrapPluginVisitorMethod,
      };
    },
  };
});

// https://webpack.js.org/api/plugins/
class BabelTimingPlugin {
  constructor({output = 'console'} = {}) {
    this._output = output;
  }

  apply(compiler) {
    compiler.hooks.done.tap('Babel timing Plugin', stats => {
      const results = timers.map(timer => timer.getResults());
      render(results, {output: this._output});
      timers = [];
    });
  }
}

exports.babelTimingLoader = babelTimingLoader;
exports.BabelTimingPlugin = BabelTimingPlugin;
exports.default = babelTimingLoader;
