var differ = require('ansi-diff-stream');
const FileList = require('./FileList');
const PluginList = require('./PluginList');
const {enableKeyPressEvent} = require('./utils');

function renderFileList(results, selected = 0, diff, paginationSize) {
  const output = new FileList({
    results,
    selected,
    onSelected: selected => {
      output.clear();
      output.stop();
      renderPluginList(results, selected, diff, paginationSize);
    },
    diff,
    paginationSize,
  });
}

function renderPluginList(results, resultIndex, diff, paginationSize) {
  const output = new PluginList({
    results: results[resultIndex],
    onBack: () => {
      output.clear();
      output.stop();
      renderFileList(results, resultIndex, diff, paginationSize);
    },
    diff,
    paginationSize,
  });
}

function renderer(results = [], {paginationSize} = {}) {
  enableKeyPressEvent();

  // Init ansi-diff-stream
  const diff = differ();
  diff.pipe(process.stdout);

  renderFileList(results, undefined, diff, paginationSize);
}

module.exports = renderer;
