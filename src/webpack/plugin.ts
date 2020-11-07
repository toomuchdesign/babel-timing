import { render, timersCollection } from '../index';
import { Plugin, Compiler } from 'webpack';

type Options = Parameters<typeof render>[1];

// https://webpack.js.org/api/plugins/
export default class BabelTimingPlugin implements Plugin {
  private _options: Options;
  constructor({ output = 'console', ...otherOptions }: Options) {
    this._options = {
      output,
      ...otherOptions,
    };
  }

  apply(compiler: Compiler) {
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
