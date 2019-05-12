const render = require('../src/render');
const {getTimers, clearTimers} = require('./babel-loader-customize');

// https://webpack.js.org/api/plugins/
class BabelTimingPlugin {
  constructor({output = 'console', outputPath} = {}) {
    this._options = {
      output,
      outputPath,
    };
  }

  apply(compiler) {
    compiler.hooks.done.tap('Babel timing Plugin', stats => {
      const results = getTimers().map(timer => timer.getResults());
      clearTimers();
      setImmediate(() => {
        render(results, this._options);
      });
    });
  }
}

module.exports = BabelTimingPlugin;
