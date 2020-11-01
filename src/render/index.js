const path = require('path');
const fs = require('fs');
const cliRenderer = require('./cliRenderer');
const aggregateByPlugins = require('./aggregateByPlugins/index.ts').default;
const joinFileResultsFromSameModule = require('./joinFileResultsFromSameModule')
  .default;
const { sortByProperty } = require('../utils');

function render(
  results,
  {
    expandPackages,
    output = 'return',
    outputPath = './babel-timing-results.json',
    aggregateBy = 'files',
    paginationSize,
  } = {}
) {
  if (!expandPackages) {
    results = joinFileResultsFromSameModule(results);
  }

  if (aggregateBy === 'plugins') {
    results = aggregateByPlugins(results);
  }

  results = results.sort(sortByProperty('time'));

  switch (output) {
    case 'return': {
      return results;
    }
    case 'console': {
      cliRenderer(results, { paginationSize });
      return;
    }
    case 'json': {
      fs.writeFileSync(outputPath, JSON.stringify(results));
      return;
    }
  }
}

module.exports = render;
