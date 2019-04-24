const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const Table = require('cli-table');
const Benchmark = require('./Benchmark');

function babelTiming(file, {babelConfig = false} = {}) {
  const b = new Benchmark();

  // https://babeljs.io/docs/en/options#configfile
  babel.transformSync(fs.readFileSync(file).toString(), {
    filename: file,
    configFile: babelConfig ? path.join(process.cwd(), babelConfig) : false,
    minified: true,
    compact: true,
    wrapPluginVisitorMethod(pluginAlias, visitorType, callback) {
      return function(...args) {
        b.push(pluginAlias);
        callback.call(this, ...args);
        b.pop(pluginAlias);
      };
    },
  });

  const table = new Table({
    head: ['pluginAlias', 'time(ms)', '# visits', 'time/visit(ms)'],
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: ' ',
    },
    style: {
      'padding-left': 0,
      'padding-right': 0,
      head: ['bold'],
    },
  });

  const results = Object.keys(b.results)
    .map(name => [name, b.results[name].aggregate, b.visits[name]])
    .sort((a, b) => {
      if (a[1] < b[1]) return 1;
      if (a[1] > b[1]) return -1;
      return 0;
    })
    .map(arr => [
      arr[0],
      arr[1].toFixed(3),
      arr[2],
      (arr[1] / arr[2]).toFixed(3),
    ]);

  table.push(...results);

  console.log(`File name: ${file}: ${b.totalTime.toFixed(3)} s`);
  console.log(table.toString());
}

module.exports = babelTiming;
