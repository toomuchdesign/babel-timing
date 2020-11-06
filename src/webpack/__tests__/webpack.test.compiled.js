const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

function getFileList(results) {
  return results.map(entry => entry.name);
}

// @NOTE Temporarily disabled because cli command needs transpilation
describe('Webpack integration', () => {
  it('return expected results as JSON', async () => {
    const entryFile = path.join(__dirname, '__fixtures__/entry.js');
    const webpackConfig = path.join(
      __dirname,
      '__fixtures__/webpack.config.js'
    );
    const buildFolder = path.join(__dirname, '__fixtures__/dist.temp');
    const expectedResultsPath = path.join(
      __dirname,
      '__fixtures__/results.temp.json'
    );

    await exec(
      `webpack ${entryFile} --config=${webpackConfig} --output-path=${buildFolder}`
    );

    const results = JSON.parse(fs.readFileSync(expectedResultsPath));
    const files = getFileList(results);

    rimraf.sync(expectedResultsPath);
    rimraf.sync(buildFolder);

    expect(files.length).toBe(9);
    expect(files).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/entry.js'),
        expect.stringContaining('/sum.js'),
        expect.stringContaining('/sub.js'),
        expect.stringContaining('/node_modules/minimatch/'),
        expect.stringContaining('/node_modules/brace-expansion/'),
        expect.stringContaining('/node_modules/balanced-match/'),
        expect.stringContaining('/node_modules/concat-map/'),
        // Added by webpack
        expect.stringContaining('/node_modules/path-browserify/'),
        expect.stringContaining('/node_modules/process/'),
      ])
    );
  });
});
