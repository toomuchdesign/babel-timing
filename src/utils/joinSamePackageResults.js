const mergeWith = require('lodash.mergewith');
const {hasEntryWithProperty, onlyUnique} = require('./utils');

const PACKAGE_NAME_REGEX = /(.*\/node_modules\/)((?:@.+?\/)?.+?\/)/;

function normalizeResultName(name) {
  const parsed = PACKAGE_NAME_REGEX.exec(name);

  if (!parsed) {
    return name;
  }
  return parsed[0];
}

function mergeStrategy(objValue, srcValue, key) {
  if (key === 'data') {
    return joinDataArrays(objValue, srcValue);
  }
  if (typeof objValue === 'string') {
    return objValue;
  }
  if (typeof objValue === 'number') {
    return objValue + srcValue;
  }
}

function joinDataArrays(data1, data2) {
  const entries = [...data1, ...data2];
  return entries
    .map(entry => entry.plugin)
    .filter(onlyUnique)
    .map(pluginName => {
      const samePlugin = entries.filter(data => data.plugin === pluginName);
      return mergeWith(...samePlugin, mergeStrategy);
    })
    .map(entry => ({
      ...entry,
      timePerVisit: entry.time / entry.visits,
    }))
    .sort((a, b) => {
      if (a.time < b.time) return 1;
      if (a.time > b.time) return -1;
      return 0;
    });
}

function removeResult(name, results) {
  let extracted;
  results.forEach((result, index) => {
    if (result.name === name) {
      extracted = result;
      results.splice(index, 1);
    }
  });

  return extracted;
}

function joinSamePackageResults(results) {
  const joinedResults = [];

  results.forEach(result => {
    const normalizedName = normalizeResultName(result.name);
    let newResult;

    if (hasEntryWithProperty('name', normalizedName, joinedResults)) {
      const stored = removeResult(normalizedName, joinedResults);
      newResult = mergeWith(stored, result, mergeStrategy);
    } else {
      newResult = result;
    }

    joinedResults.push({
      ...newResult,
      name: normalizedName,
    });
  });

  return joinedResults;
}

module.exports = joinSamePackageResults;
