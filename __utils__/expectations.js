const expectedPluginsEntry = {
  plugin: expect.any(String),
  timePerVisit: expect.any(Number),
  time: expect.any(Number),
  visits: expect.any(Number),
};

const expectedResultsEntry = {
  name: expect.any(String),
  totalTime: expect.any(Number),
  plugins: expect.arrayContaining([expectedPluginsEntry]),
};

const expectedResults = expect.arrayContaining([expectedResultsEntry]);

module.exports = {
  expectedPluginsEntry,
  expectedResultsEntry,
  expectedResults,
};
