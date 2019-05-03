const Table = require('cli-table');
var colors = require('colors/safe');

function renderer(results = []) {
  if (!results.length) {
    console.log('No files found');
    return;
  }
  const hasPlugins = Array.isArray(results[0].plugins);

  if (hasPlugins) {
    results.forEach(entry => {
      renderTableWithPlugins(entry);
    });
  } else {
    renderTable(results);
  }
}

function renderTable(results) {
  const table = new Table({
    head: ['File name', 'Total time(ms)'],
  });

  const tableData = results.map(entry => [
    entry.name,
    entry.totalTime.toFixed(3),
  ]);

  table.push(...tableData);
  console.log(table.toString());
}

function renderTableWithPlugins({name, totalTime, plugins = []}) {
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

  const tableData = plugins.map(entry => [
    entry.plugin,
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
