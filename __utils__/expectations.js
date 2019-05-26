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

// Aggregation by plugins
const expectedFilesEntry = expectedPluginsEntry;

const expectedResultsEntryAggregatedByPlugins = {
  name: expect.any(String),
  time: expect.any(Number),
  files: expect.arrayContaining([expectedFilesEntry]),
};

const expectedResultsAggregatedByPlugins = expect.arrayContaining([
  expectedResultsEntryAggregatedByPlugins,
]);

module.exports = {
  expectedPluginsEntry,
  expectedResultsEntry,
  expectedResults,
  expectedResultsAggregatedByPlugins,
};
