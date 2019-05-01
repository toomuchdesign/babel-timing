const path = require('path');
const babelTiming = require('../index').babelTiming;
const FIXTURES = '__fixtures__';

const expectedResultsEntry = {
  name: expect.any(String),
  totalTime: expect.any(Number),
  data: expect.any(Array),
};

const expectedResultsDataEntry = {
  plugin: expect.any(String),
  timePerVisit: expect.any(Number),
  time: expect.any(Number),
  visits: expect.any(Number),
};

describe('babelTiming', () => {
  describe('results', () => {
    it('has expected shape', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-1.js')]);
      expect(Array.isArray(results)).toBe(true);

      const resultsEntry = results[0];
      expect(resultsEntry).toEqual(expectedResultsEntry);

      const resultDataEntry = resultsEntry.data[0];
      expect(resultDataEntry).toEqual(expectedResultsDataEntry);
    });

    it('entries are sorted by decreasing "totalTime"', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-*.js')]);
      let previous = Infinity;

      results.forEach(entry => {
        expect(previous >= entry.totalTime).toBe(true);
        previous = entry.totalTime;
      });
    });

    it('plugins data entries are sorted by decreasing "time"', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'file-*.js')]);
      const resultsEntry = results[0];
      let previous = Infinity;

      resultsEntry.data.forEach(entry => {
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
    it('returns 4 relative import results', async () => {
      const results = await babelTiming([path.join(FIXTURES, 'entry.js')], {
        followImports: true,
      });
      expect(results.length).toBe(4);
    });
  });
});
