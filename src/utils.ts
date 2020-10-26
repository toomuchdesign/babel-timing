const glob = require('glob');
const {existsSync} = require('fs');

function globPatternsToPaths(patterns: string[]): string[] {
  const paths = [] as string[];
  patterns.forEach(pattern => {
    if (glob.hasMagic(pattern)) {
      paths.push(...glob.sync(pattern));
    } else if (existsSync(pattern)) {
      paths.push(pattern);
    }
  });
  return paths;
}

function onlyUnique<Value>(value: Value, index: number, self: any[]): boolean {
  return self.indexOf(value) === index;
}

function sortByProperty(prop: string) {
  return (a: {[key: string]: any}, b: {[key: string]: any}) => {
    if (a[prop] < b[prop]) return 1;
    if (a[prop] > b[prop]) return -1;
    return 0;
  };
}

function valueInRange(
  value: number,
  {min = -Infinity, max = Infinity}: {min?: number; max?: number} = {}
): number {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

exports.globPatternsToPaths = globPatternsToPaths;
exports.onlyUnique = onlyUnique;
exports.sortByProperty = sortByProperty;
exports.valueInRange = valueInRange;
