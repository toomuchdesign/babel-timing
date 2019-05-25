const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const {expectedResults} = require('../../__utils__/expectations');

describe('Jest integration', () => {
  it('return expected results as JSON', async () => {
    const testFile = path.join(__dirname, '__fixtures__/test.js');
    const jestConfig = path.join(__dirname, '__fixtures__/jest.config.js');
    const expectedResultsPath = path.join(
      __dirname,
      '__fixtures__/results.temp.json'
    );

    await exec(`jest ${testFile} --config=${jestConfig} --no-cache`);

    const actual = JSON.parse(fs.readFileSync(expectedResultsPath));
    rimraf.sync(expectedResultsPath);

    expect(actual).toEqual(expectedResults);
  });
});
