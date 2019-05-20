const {render, timersCollection} = require('../src');

// https://webpack.js.org/api/plugins/
class BabelTimingPlugin {
  constructor({output = 'console', ...otherOptions} = {}) {
    this._options = {
      output,
      ...otherOptions,
    };
  }

  apply(compiler) {
    compiler.hooks.done.tap('Babel timing Plugin', stats => {
      const results = timersCollection
        .getAll()
        .map(timer => timer.getResults());
      timersCollection.clear();

      if (this._options.output === 'console') {
        setImmediate(() => {
          render(results, this._options);
        });
      } else {
        render(results, this._options);
      }
    });
  }
}

module.exports = BabelTimingPlugin;
