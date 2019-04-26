const Table = require('cli-table');
var colors = require('colors/safe');

function renderer(results = []) {
  results.forEach(entry => {
    renderEntry(entry);
  });
}

function renderEntry({name, totalTime, data}) {
  const dataArray = Object.keys(data)
    .map(pluginAlias => ({
      name: pluginAlias,
      ...data[pluginAlias],
    }))
    .sort((a, b) => {
      if (a.time < b.time) return 1;
      if (a.time > b.time) return -1;
      return 0;
    });

  const table = new Table({
    head: ['pluginAlias', 'time(ms)', 'visits', 'time/visit(ms)'],
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

  const tableData = dataArray.map(entry => [
    entry.name,
    entry.time.toFixed(3),
    entry.visits,
    entry.timePerVisit.toFixed(3),
  ]);

  table.push(...tableData);

  console.log(colors.bold.inverse(` File name: ${name} `));
  console.log(colors.bold.inverse(` Total time(ms): ${totalTime.toFixed(3)} `));
  console.log(table.toString());
}

module.exports = renderer;
