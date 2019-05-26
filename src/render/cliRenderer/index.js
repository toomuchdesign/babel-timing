var differ = require('ansi-diff-stream');
const Table = require('./Table');
const {enableKeyPressEvent} = require('./utils');

function renderFileList({results, selected = 0, diff, paginationSize} = {}) {
  const output = new Table({
    title: 'Babel timing - trasformed files',
    entries: results,
    entriesMap: [
      ['File', entry => entry.name],
      ['Total time(ms)', entry => entry.totalTime.toFixed(3)],
    ],
    selectable: true,
    selected,
    onSelected: selected => {
      diff.clear();
      output.unmount();
      renderPluginList({results, resultIndex: selected, diff, paginationSize});
    },
    onSelectedCommandInfo: 'show file detail',
    paginationSize,
    onRender: output => {
      diff.write(output);
    },
  });
}

function renderPluginList({results, resultIndex, diff, paginationSize} = {}) {
  const fileResult = results[resultIndex];
  const output = new Table({
    title: `Babel timing - info for file: ${fileResult.name}`,
    entries: fileResult.plugins,
    entriesMap: [
      ['pluginAlias', entry => entry.plugin],
      ['time(ms)', entry => entry.time.toFixed(3)],
      ['visits', entry => entry.visits],
      ['time/visit(ms)', entry => entry.timePerVisit.toFixed(3)],
    ],
    onEscape: () => {
      diff.clear();
      output.unmount();
      renderFileList({results, selected: resultIndex, diff, paginationSize});
    },
    onEscapeCommandInfo: 'back to results list',
    paginationSize,
    onRender: output => {
      diff.write(output);
    },
  });
}

function renderer(results = [], {paginationSize} = {}) {
  enableKeyPressEvent();

  // Init ansi-diff-stream
  const diff = differ();
  diff.pipe(process.stdout);

  renderFileList({
    results,
    diff,
    paginationSize,
  });
}

module.exports = renderer;
