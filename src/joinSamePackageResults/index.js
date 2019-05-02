const mergeWith = require('lodash.mergewith');
const PluginsTimer = require('../PluginsTimer');
const {hasEntryWithProperty, onlyUnique} = require('../utils');

const PACKAGE_NAME_REGEX = /(.*\/node_modules\/)((?:@.+?\/)?.+?\/)/;

// Return normalized name in case on "node_modules" package otherwise the original one
function normalizeResultName(name) {
  const parsed = PACKAGE_NAME_REGEX.exec(name);
  if (!parsed) {
    return name;
  }
  return parsed[0];
}

function mergeStrategy(objValue, srcValue, key) {
  if (key === 'plugins') {
    return PluginsTimer.mergeResults(objValue, srcValue);
  }
  if (typeof objValue === 'string') {
    return objValue;
  }
  if (typeof objValue === 'number') {
    return objValue + srcValue;
  }
}

function joinSamePackageResults(originalResults) {
  const normalizedResults = originalResults.map(result => ({
    ...result,
    name: normalizeResultName(result.name),
  }));

  return (
    normalizedResults
      // Get list of all name-normalized entries
      .map(result => result.name)
      .filter(onlyUnique)
      // Merge results with same name
      .map(name => {
        const sameName = normalizedResults.filter(
          result => result.name === name
        );
        return mergeWith(...sameName, mergeStrategy);
      })
  );
}

module.exports = joinSamePackageResults;
