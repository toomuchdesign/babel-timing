const expectedPluginsEntry = {
  name: expect.any(String),
  time: expect.any(Number),
  timePerVisit: expect.any(Number),
  visits: expect.any(Number),
};

const expectedResultsEntry = {
  name: expect.any(String),
  time: expect.any(Number),
  plugins: expect.arrayContaining([expectedPluginsEntry]),
};

const expectedResults = expect.arrayContaining([expectedResultsEntry]);

module.exports = {
  expectedPluginsEntry,
  expectedResultsEntry,
  expectedResults,
};
