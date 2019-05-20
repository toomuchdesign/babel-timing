const babelJest = require('babel-jest');
const {timersCollection} = require('../src');

// Keep track of the file currently being traspiled in current module scope :-(
let currentFile;

// https://jestjs.io/docs/en/tutorial-react#custom-transformers
function createTransformer() {
  const babelJestTransformer = babelJest.createTransformer({
    wrapPluginVisitorMethod: (...args) => {
      const visitorWrapper = timersCollection.getTimer(currentFile)
        .wrapPluginVisitorMethod;
      return visitorWrapper(...args);
    },
  });

  function customProcess(...args) {
    currentFile = args[1];
    return babelJestTransformer.process(...args);
  }

  return {
    ...babelJestTransformer,
    process: customProcess,
  };
}

module.exports = createTransformer();
