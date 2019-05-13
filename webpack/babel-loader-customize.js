const PluginsTimer = require('../src/PluginsTimer');
let timers = [];

// https://github.com/babel/babel-loader#example
const babelLoaderCustomize = () => {
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
};

function getTimers() {
  return [...timers];
}

function clearTimers() {
  timers = [];
}

module.exports = {
  default: babelLoaderCustomize,
  getTimers: getTimers,
  clearTimers: clearTimers,
  __esModule: true,
};