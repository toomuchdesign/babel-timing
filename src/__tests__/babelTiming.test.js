const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const rimraf = require('rimraf');
const { babelTiming } = require('../index');
const FIXTURES = '__fixtures__';
const {
  expectedResults,
  expectedResultsAggregatedByPlugins,
} = require('../../__utils__/expectations');

function getFileList(results) {
  return results.map(entry => entry.name);
}

describe('babelTiming', () => {
  it('results have expected shape', async () => {
    const results = await babelTiming([path.join(FIXTURES, 'file-*.js*')]);
    expect(results).toEqual(expectedResults);
  });

  it('return empty array when no files are found', async () => {
    const results = await babelTiming([path.join(FIXTURES, 'not-existing.js')]);
    expect(results).toEqual([]);
  });

  it('entries are sorted by decreasing "time"', async () => {
    const results = await babelTiming([path.join(FIXTURES, 'file-*.js*')]);
    let previous = Infinity;

    results.forEach(entry => {
      expect(previous >= entry.time).toBe(true);
      previous = entry.time;
    });
  });

  it('plugins data entries are sorted by decreasing "time"', async () => {
    const results = await babelTiming([path.join(FIXTURES, 'file-*.js*')]);
    const resultsEntry = results[0];
    let previous = Infinity;

    resultsEntry.plugins.forEach(entry => {
      expect(previous >= entry.time).toBe(true);
      previous = entry.time;
    });
  });

  describe('glob patterns', () => {
    it('returns results matching expected pattern', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-*.js*')]);
      expect(results.length).toBe(3);
    });
  });

  describe('"followImports" option', () => {
    it('returns result with 4 relative imports', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'entry.js')], {
        followImports: true,
      });
      const files = getFileList(results);

      expect(files.length).toBe(5);
      expect(files).toEqual(
        expect.arrayContaining([
          expect.stringContaining('/entry.js'),
          expect.stringContaining('/file-1.js'),
          expect.stringContaining('/file-2.js'),
          expect.stringContaining('/file-3.js'),
          expect.stringContaining('/file-4/index.js'),
        ])
      );
    });

    describe('with "exclude" option set to []', () => {
      it('returns both relative and absolute "node_modules" imports', async () => {
        const results = await babelTiming([path.join(FIXTURES, 'entry.js')], {
          followImports: true,
          exclude: [],
        });
        const files = getFileList(results);

        expect(files.length).toBe(9);
        expect(files).toEqual(
          expect.arrayContaining([
            expect.stringContaining('/entry.js'),
            expect.stringContaining('/file-1.js'),
            expect.stringContaining('/file-2.js'),
            expect.stringContaining('/file-3.js'),
            expect.stringContaining('/file-4/index.js'),
            expect.stringContaining('/node_modules/minimatch/'),
            expect.stringContaining('/node_modules/brace-expansion/'),
            expect.stringContaining('/node_modules/balanced-match/'),
            expect.stringContaining('/node_modules/concat-map/'),
          ])
        );
      });
    });

    describe('with "exclude" targeting specific package', () => {
      it("does not include package's sub dependencies", async () => {
        const results = await babelTiming([path.join(FIXTURES, 'entry.js')], {
          followImports: true,
          exclude: ['**/node_modules/minimatch/**'],
        });
        const files = getFileList(results);

        expect(files.length).toBe(5);
        expect(files).toEqual(
          expect.arrayContaining([
            expect.stringContaining('/entry.js'),
            expect.stringContaining('/file-1.js'),
            expect.stringContaining('/file-2.js'),
            expect.stringContaining('/file-3.js'),
            expect.stringContaining('/file-4/index.js'),
          ])
        );
      });
    });
  });

  // Render options
  describe('"output" option', () => {
    describe('is "json"', () => {
      describe('"outputPath" is relative path', () => {
        it('save result as JSON at the path specified by "outputPath" option', async () => {
          await babelTiming([path.join(FIXTURES, 'entry.js')], {
            output: 'json',
            outputPath: './results.temp.json',
          });
          const expectedFilePath = path.join(
            process.cwd(),
            'results.temp.json'
          );
          const actual = JSON.parse(fs.readFileSync(expectedFilePath));

          fs.unlinkSync(expectedFilePath);
          expect(actual).toEqual(expectedResults);
        });
      });

      describe('"outputPath" is absolute path', () => {
        it('save result as JSON at the path specified by "outputPath" option', async () => {
          const absoluteFilePath = path.resolve(
            process.cwd(),
            'results.temp.json'
          );
          await babelTiming([path.join(FIXTURES, 'entry.js')], {
            output: 'json',
            outputPath: absoluteFilePath,
          });
          const actual = JSON.parse(fs.readFileSync(absoluteFilePath));

          fs.unlinkSync(absoluteFilePath);
          expect(actual).toEqual(expectedResults);
        });
      });
    });
  });

  describe('"aggregateBy" === "plugins"', () => {
    it('return result aggregated by plugins -> files', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-*.js*')], {
        aggregateBy: 'plugins',
      });

      expect(results).toEqual(expectedResultsAggregatedByPlugins);
    });
  });
});
