import { render, timersCollection } from '../index';
import { Reporter } from '@jest/reporters';
import { Config } from '@jest/types';

type Options = Parameters<typeof render>[0];

// https://jestjs.io/docs/en/configuration#reporters-array-modulename-modulename-options
export default class BabelTimingReporter implements Reporter {
  private _options: Options;
  constructor(
    globalConfig: Config.GlobalConfig,
    { output = 'console', ...otherOptions }: Options
  ) {
    this._options = { output, ...otherOptions };
  }

  onRunComplete() {
    const results = timersCollection.getAll().map(timer => timer.getResults());
    timersCollection.clear();

    // Render output after Jest's pending async operations check
    // @TODO Find a more elegant way of dealing with async operations check
    if (this._options.output === 'console') {
      setTimeout(() => {
        render({
          ...this._options,
          results,
        });
      }, 1500);
    } else {
      render({
        ...this._options,
        results,
      });
    }
  }

  onRunStart() {}
  getLastError() {}
}
