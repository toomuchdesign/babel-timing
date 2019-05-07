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
  } = {}
) {
  if (!expandPackages) {
    results = joinSamePackageResults(results);
  }
  results = results.sort(sortByProperty('totalTime'));

  switch (output) {
    case 'return': {
      return results;
    }
    case 'console': {
      cliRenderer(results);
      return;
    }
    case 'json': {
      fs.writeFileSync(
        path.join(process.cwd(), outputPath),
        JSON.stringify(results)
      );
      return;
    }
  }
}

module.exports = render;
