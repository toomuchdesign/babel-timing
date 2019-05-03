const path = require('path');
const babelTiming = require('../index').babelTiming;
const FIXTURES = '__fixtures__';

const expectedResultsEntry = {
  name: expect.any(String),
  totalTime: expect.any(Number),
};

const expectedPluginsEntry = {
  plugin: expect.any(String),
  timePerVisit: expect.any(Number),
  time: expect.any(Number),
  visits: expect.any(Number),
};

const expectedResultsEntryWithPlugins = {
  ...expectedResultsEntry,
  plugins: expect.arrayContaining([expectedPluginsEntry]),
};

function getFileList(results) {
  return results.map(entry => entry.name);
}

describe('babelTiming', () => {
  it('results have expected shape', async () => {
    const results = await babelTiming([path.join(FIXTURES, 'file-1.js')]);
    const resultsEntry = results[0];
    expect(resultsEntry).toEqual(expectedResultsEntry);
  });

  it('return empty array when no files are found', async () => {
    const results = await babelTiming([path.join(FIXTURES, 'not-existing.js')]);
    expect(results).toEqual([]);
  });

  it('entries are sorted by decreasing "totalTime"', async () => {
    const results = await babelTiming([path.join(FIXTURES, 'file-*.js')]);
    let previous = Infinity;

    results.forEach(entry => {
      expect(previous >= entry.totalTime).toBe(true);
      previous = entry.totalTime;
    });
  });

  describe('"expandPlugins" option', () => {
    it('results have expected shape', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-*.js')], {
        expandPlugins: true,
      });
      const resultsEntry = results[0];
      expect(resultsEntry).toEqual(expectedResultsEntryWithPlugins);
    });

    it('plugins data entries are sorted by decreasing "time"', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-*.js')], {
        expandPlugins: true,
      });
      const resultsEntry = results[0];
      let previous = Infinity;

      resultsEntry.plugins.forEach(entry => {
        expect(previous >= entry.time).toBe(true);
        previous = entry.time;
      });
    });
  });

  describe('glob patterns', () => {
    it('returns results matching expected pattern', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-*.js')]);
      expect(results.length).toBe(3);
    });
  });

  describe('"followImports" option', () => {
    it('returns result with 4 relative imports', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'entry.js')], {
        followImports: true,
      });
      const files = getFileList(results);

      expect(files.length).toBe(4);
      expect(files).toEqual(
        expect.arrayContaining([
          expect.stringContaining('/entry.js'),
          expect.stringContaining('/file-1.js'),
          expect.stringContaining('/file-2.js'),
          expect.stringContaining('/file-3.js'),
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

        expect(files.length).toBe(8);
        expect(files).toEqual(
          expect.arrayContaining([
            expect.stringContaining('/entry.js'),
            expect.stringContaining('/file-1.js'),
            expect.stringContaining('/file-2.js'),
            expect.stringContaining('/file-3.js'),
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

        expect(files.length).toBe(4);
        expect(files).toEqual(
          expect.arrayContaining([
            expect.stringContaining('/entry.js'),
            expect.stringContaining('/file-1.js'),
            expect.stringContaining('/file-2.js'),
            expect.stringContaining('/file-3.js'),
          ])
        );
      });
    });
  });
});
