const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

function getFileList(results) {
  return results.map(entry => entry.name);
}

jest.setTimeout(10000);

describe('Jest integration', () => {
  it('return expected results as JSON', async () => {
    const testFile = path.join(__dirname, '__fixtures__/test.js');
    const jestConfig = path.join(__dirname, '__fixtures__/jest.config.js');
    const expectedResultsPath = path.join(
      __dirname,
      '__fixtures__/results.temp.json'
    );
    await exec(`jest ${testFile} --config=${jestConfig} --no-cache`);

    const results = JSON.parse(fs.readFileSync(expectedResultsPath));
    const files = getFileList(results);
    expect(2).toBe(2);
    rimraf.sync(expectedResultsPath);

    expect(files.length).toBe(3);
    expect(files).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/test.js'),
        expect.stringContaining('/sub.js'),
        expect.stringContaining('/sum.js'),
      ])
    );
  });
});
