const glob = require('glob');
const fs = require('fs');

function globPatternsToPaths(patterns) {
  const paths = [];
  patterns.forEach(pattern => {
    if (glob.hasMagic(pattern)) {
      paths.push(...glob.sync(pattern));
    } else if (fs.existsSync(pattern)) {
      paths.push(pattern);
    }
  });
  return paths;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function sortByProperty(prop) {
  return (a, b) => {
    if (a[prop] < b[prop]) return 1;
    if (a[prop] > b[prop]) return -1;
    return 0;
  };
}

function hasEntryWithProperty(propName, value, arr) {
  let i;
  for (i = 0; i < arr.length; i++) {
    if (arr[i][propName] === value) {
      return true;
    }
  }
  return false;
}

function valueInRange(value, {min = -Infinity, max = Infinity} = {}) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

exports.hasEntryWithProperty = hasEntryWithProperty;
exports.globPatternsToPaths = globPatternsToPaths;
exports.onlyUnique = onlyUnique;
exports.sortByProperty = sortByProperty;
exports.valueInRange = valueInRange;
