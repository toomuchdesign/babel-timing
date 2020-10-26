const {timersCollection} = require('../index.ts');

// https://github.com/babel/babel-loader#example
const babelLoaderCustomize = () => {
  return {
    // Babel's 'PartialConfig' object.
    config(cfg) {
      const timer = timersCollection.getTimer(cfg.options.filename);
      return {
        ...cfg.options,
        wrapPluginVisitorMethod: timer.wrapPluginVisitorMethod,
      };
    },
  };
};

module.exports = babelLoaderCustomize;
