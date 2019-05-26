const path = require('path');
const fs = require('fs');
const cliRenderer = require('./cliRenderer');
const joinSamePackageResults = require('./joinSamePackageResults');
const {sortByProperty} = require('../utils');

function render(
  results,
  {
    expandPackages,
    output = 'return',
    outputPath = './babel-timing-results.json',
    paginationSize,
  } = {}
) {
  if (!expandPackages) {
    results = joinSamePackageResults(results);
  }
  results = results.sort(sortByProperty('time'));

  switch (output) {
    case 'return': {
      return results;
    }
    case 'console': {
      cliRenderer(results, {paginationSize});
      return;
    }
    case 'json': {
      fs.writeFileSync(outputPath, JSON.stringify(results));
      return;
    }
  }
}

module.exports = render;
