const FileList = require('./FileList');
const PluginList = require('./PluginList');

function renderFileList(results, selected = 0) {
  const output = new FileList({
    results,
    selected,
    onSelected: selected => {
      output.clear();
      output.stop();
      renderPluginList(results, selected);
    },
  });
}

function renderPluginList(results, resultIndex) {
  const output = new PluginList({
    results: results[resultIndex],
    onBack: () => {
      output.clear();
      output.stop();
      renderFileList(results, resultIndex);
    },
  });
}

function renderer(results = []) {
  renderFileList(results);
}

module.exports = renderer;
