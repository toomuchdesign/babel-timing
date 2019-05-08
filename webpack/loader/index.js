const PluginsTimer = require('../../src/PluginsTimer');
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

function getTimers() {
  return [...timers];
}

function clearTimers() {
  timers = [];
}

exports.default = babelTimingLoader;
exports.getTimers = getTimers;
exports.clearTimers = clearTimers;
