const glob = require('glob');

function globPatternsToPaths(patterns) {
  const paths = [];
  patterns.forEach(pattern => {
    if (glob.hasMagic(pattern)) {
      paths.push(...glob.sync(pattern));
    } else {
      paths.push(pattern);
    }
  });
  return paths;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
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

exports.hasEntryWithProperty = hasEntryWithProperty;
exports.globPatternsToPaths = globPatternsToPaths;
exports.onlyUnique = onlyUnique;
