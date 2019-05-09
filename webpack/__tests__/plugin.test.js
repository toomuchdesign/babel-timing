const WebpackPlugin = require('../plugin');
const callbackMock = jest.fn();
const webpackCompilerMock = {
  hooks: {
    done: {
      tap: callbackMock,
    },
  },
};

jest.useFakeTimers();
beforeEach(() => {
  jest.clearAllMocks();
});

describe('webpack/plugin', () => {
  it('runs without errors', () => {
    const instance = new WebpackPlugin({output: 'return'});
    instance.apply(webpackCompilerMock);
    const [pluginName, callback] = callbackMock.mock.calls[0];
    callback();
    jest.runAllImmediates();
  });
});
