const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const rimraf = require('rimraf');
const FIXTURES = '__fixtures__';
const { bin } = require('../../package.json');

describe('babelTiming', () => {
  // @NOTE Temporarily disabled because cli command needs transpilation
  describe('"--read-results" CLI option', () => {
    it('render results object provided as path', async () => {
      const resultsPath = path.join(FIXTURES, 'results.json');
      const expectedResultsPath = path.join(
        FIXTURES,
        'generated.results.temp.json'
      );

      await exec(
        `node ${bin} --read-results ${resultsPath} --output-path ${expectedResultsPath} --output json`
      );

      const expected = JSON.parse(fs.readFileSync(resultsPath));
      const actual = JSON.parse(fs.readFileSync(expectedResultsPath));
      rimraf.sync(expectedResultsPath);

      expect(actual).toEqual(expected);
    });
  });
});
