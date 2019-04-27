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

exports.globPatternsToPaths = globPatternsToPaths;
exports.onlyUnique = onlyUnique;
