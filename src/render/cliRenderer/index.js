var differ = require('ansi-diff-stream');
const Table = require('./Table');
const { enableKeyPressEvent } = require('./utils');

function renderFileList({ results, selected = 0, diff, paginationSize } = {}) {
  const output = new Table({
    title: 'Babel timing - trasformed files',
    entries: results,
    entriesMap: [
      ['File', entry => entry.name],
      ['Total time(ms)', entry => entry.time.toFixed(3)],
    ],
    selectable: true,
    selected,
    onSelected: selected => {
      diff.clear();
      output.unmount();
      renderFileDetails({
        results,
        resultIndex: selected,
        diff,
        paginationSize,
      });
    },
    onSelectedCommandInfo: 'show file detail',
    paginationSize,
    onRender: output => {
      diff.write(output);
    },
  });
}

function renderFileDetails({
  results,
  resultIndex,
  diff,
  paginationSize,
} = {}) {
  const fileResult = results[resultIndex];
  const output = new Table({
    title: `Babel timing - info for file: ${fileResult.name}`,
    entries: fileResult.plugins,
    entriesMap: [
      ['pluginAlias', entry => entry.name],
      ['time(ms)', entry => entry.time.toFixed(3)],
      ['visits', entry => entry.visits],
      ['time/visit(ms)', entry => entry.timePerVisit.toFixed(3)],
    ],
    onEscape: () => {
      diff.clear();
      output.unmount();
      renderFileList({ results, selected: resultIndex, diff, paginationSize });
    },
    onEscapeCommandInfo: 'back to results list',
    paginationSize,
    onRender: output => {
      diff.write(output);
    },
  });
}

function renderPluginList({
  results,
  selected = 0,
  diff,
  paginationSize,
} = {}) {
  const output = new Table({
    title: 'Babel timing - plugins called',
    entries: results,
    entriesMap: [
      ['Plugin', entry => entry.name],
      ['Total time(ms)', entry => entry.time.toFixed(3)],
    ],
    selectable: true,
    selected,
    onSelected: selected => {
      diff.clear();
      output.unmount();
      renderPluginDetails({
        results,
        resultIndex: selected,
        diff,
        paginationSize,
      });
    },
    onSelectedCommandInfo: 'show plugin detail',
    paginationSize,
    onRender: output => {
      diff.write(output);
    },
  });
}

function renderPluginDetails({
  results,
  resultIndex,
  diff,
  paginationSize,
} = {}) {
  const pluginResult = results[resultIndex];
  const output = new Table({
    title: `Babel timing - info for plugin: ${pluginResult.name}`,
    entries: pluginResult.files,
    entriesMap: [
      ['file', entry => entry.name],
      ['time(ms)', entry => entry.time.toFixed(3)],
      ['visits', entry => entry.visits],
      ['time/visit(ms)', entry => entry.timePerVisit.toFixed(3)],
    ],
    onEscape: () => {
      diff.clear();
      output.unmount();
      renderPluginList({
        results,
        selected: resultIndex,
        diff,
        paginationSize,
      });
    },
    onEscapeCommandInfo: 'back to results list',
    paginationSize,
    onRender: output => {
      diff.write(output);
    },
  });
}

function renderer(results = [], { paginationSize } = {}) {
  // Duck type results to tell if data is aggregated by files or plugins.
  // @TODO Find a better way to adjust renderer on data type
  isFileList = results[0].hasOwnProperty('plugins');
  enableKeyPressEvent();

  // Init ansi-diff-stream
  const diff = differ();
  diff.pipe(process.stdout);

  const renderer = isFileList ? renderFileList : renderPluginList;
  renderer({
    results,
    diff,
    paginationSize,
  });
}

module.exports = renderer;
