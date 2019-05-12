var differ = require('ansi-diff-stream');
const FileList = require('./FileList');
const PluginList = require('./PluginList');
const {enableKeyPressEvent} = require('./utils');

function renderFileList(results, selected = 0, diff) {
  const output = new FileList({
    results,
    selected,
    onSelected: selected => {
      output.clear();
      output.stop();
      renderPluginList(results, selected, diff);
    },
    diff,
  });
}

function renderPluginList(results, resultIndex, diff) {
  const output = new PluginList({
    results: results[resultIndex],
    onBack: () => {
      output.clear();
      output.stop();
      renderFileList(results, resultIndex, diff);
    },
    diff,
  });
}

function renderer(results = []) {
  enableKeyPressEvent();

  // Init ansi-diff-stream
  const diff = differ();
  diff.pipe(process.stdout);

  renderFileList(results, undefined, diff);
}

module.exports = renderer;
