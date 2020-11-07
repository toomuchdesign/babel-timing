import babelJest from 'babel-jest';
import { Transformer } from '@jest/transform';
import { timersCollection } from '../index';
import { TransformOptions } from '@babel/core';

// Keep track of the file currently being transpiled in current module scope :-(
let currentFile: string;

// https://jestjs.io/docs/en/tutorial-react#custom-transformers
function createTransformer(): Transformer {
  const babelJestTransformer = babelJest.createTransformer({
    wrapPluginVisitorMethod: (...args) => {
      const visitorWrapper = timersCollection.getTimer(currentFile)
        .wrapPluginVisitorMethod;
      if (visitorWrapper) {
        return visitorWrapper(...args);
      }
      return visitorWrapper;
    },
    // @NOTE This object should inherit typing from babelJest but it doesn't
  } as TransformOptions);

  return {
    ...babelJestTransformer,
    process: (...args) => {
      currentFile = args[1];
      return babelJestTransformer.process(...args);
    },
  };
}

export default createTransformer();
