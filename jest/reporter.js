const {getAllTimers, clearAllTimers} = require('./babelTimers');
const render = require('../src/render');

// https://jestjs.io/docs/en/configuration#reporters-array-modulename-modulename-options
class MyCustomReporter {
  constructor(globalConfig, {output = 'console', outputPath} = {}) {
    this._options = {output, outputPath};
  }

  onRunComplete() {
    const timingResults = getAllTimers().map(entry => entry[1].getResults());
    clearAllTimers();

    // Render output after Jest's pending async operations check
    // @TODO Find a more elegant whay of dealing with async operations check
    if (this._options.output === 'console') {
      setTimeout(() => {
        render(timingResults, this._options);
      }, 1500);
    } else {
      render(timingResults, this._options);
    }
  }
}

module.exports = MyCustomReporter;
