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
  it('returns "results" of with expected shape', () => {
    const results = babelTiming([path.join(FIXTURES, 'file-1.js')]);
    expect(Array.isArray(results)).toBe(true);

    const resultsEntry = results[0];
    expect(resultsEntry).toEqual(expectedResultsEntry);

    const resultDataEntry = resultsEntry.data[0];
    expect(resultDataEntry).toEqual(expectedResultsDataEntry);
  });

  describe('glob patterns', () => {
    it('returns results matching expected pattern', () => {
      const results = babelTiming([path.join(FIXTURES, 'file-*.js')]);
      expect(results.length).toBe(3);
    });
  });

  describe('"followImports" option', () => {
    it('returns 4 relative import results', () => {
      const results = babelTiming([path.join(FIXTURES, 'entry.js')], {
        followImports: true,
      });
      expect(results.length).toBe(4);
    });
  });
});
