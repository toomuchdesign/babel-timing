const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const {expectedResults} = require('../../__utils__/expectations');

describe('Webpack integration', () => {
  it('return expected results as JSON', async () => {
    const entryFile = path.join(__dirname, '__fixtures__/entry.js');
    const webpackConfig = path.join(
      __dirname,
      '__fixtures__/webpack.config.js'
    );
    const buildFolder = path.join(__dirname, '__fixtures__/dist');
    const expectedResultsPath = path.join(
      __dirname,
      '__fixtures__/results.json'
    );

    await exec(
      `webpack ${entryFile} --config=${webpackConfig} --output-path=${buildFolder}`
    );

    const actual = JSON.parse(fs.readFileSync(expectedResultsPath));
    rimraf.sync(expectedResultsPath);
    rimraf.sync(buildFolder);

    expect(actual).toEqual(expectedResults);
  });
});
