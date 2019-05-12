const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const {expectedResults} = require('../../__utils__/expectations');

describe('Jest integration', () => {
  it('Jest return expected results as JSON', async () => {
    await exec(
      `jest ./__fixtures__/test.js --config=${__dirname}/__fixtures__/jest.config.js --no-cache`
    );

    const expectedResultsPath = path.join(
      __dirname,
      '__fixtures__/results.json'
    );

    const actual = JSON.parse(fs.readFileSync(expectedResultsPath));
    expect(actual).toEqual(expectedResults);
    fs.unlinkSync(expectedResultsPath);
  });
});
