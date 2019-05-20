const {render, timersCollection} = require('../src');

// https://jestjs.io/docs/en/configuration#reporters-array-modulename-modulename-options
class MyCustomReporter {
  constructor(globalConfig, {output = 'console', outputPath} = {}) {
    this._options = {output, outputPath};
  }

  onRunComplete() {
    const results = timersCollection.getAll().map(timer => timer.getResults());
    timersCollection.clear();

    // Render output after Jest's pending async operations check
    // @TODO Find a more elegant whay of dealing with async operations check
    if (this._options.output === 'console') {
      setTimeout(() => {
        render(results, this._options);
      }, 1500);
    } else {
      render(results, this._options);
    }
  }
}

module.exports = MyCustomReporter;
