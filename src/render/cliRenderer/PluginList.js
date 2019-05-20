const Table = require('cli-table3');
var colors = require('colors/safe');
const Pagination = require('./Pagination');

class PluginList {
  constructor({results = {}, paginationSize, onBack = () => {}, diff} = {}) {
    this.results = results;
    this.onBack = onBack;
    this.diff = diff;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Make data suitable for rendering
    const pagedPlugins = results.plugins.map((result, index) => [
      index + 1,
      result.plugin,
      result.time.toFixed(3),
      result.visits,
      result.timePerVisit.toFixed(3),
    ]);

    this.pagination = new Pagination({
      items: pagedPlugins,
      itemsPerPage: paginationSize,
    });

    process.stdin.on('keypress', this.onKeyPress);
    this.render();
  }

  onKeyPress(ch, key) {
    if (!key) {
      return;
    }

    switch (key.name) {
      case 'escape':
        return this.onBack();

      case 'left':
        return this.previousPage();

      case 'right':
        return this.nextPage();

      case 'c': {
        if (key.ctrl) {
          this.stop();
          process.exit();
        }
        return;
      }
    }
  }

  previousPage() {
    this.pagination.previousPage();
    this.render();
  }

  nextPage() {
    this.pagination.nextPage();
    this.render();
  }

  clear() {
    this.diff.clear();
  }

  stop() {
    process.stdin.removeAllListeners('keypress');
  }

  render() {
    const table = new Table({
      head: ['', 'pluginAlias', 'time(ms)', 'visits', 'time/visit(ms)'].map(
        entry => colors.yellow(entry)
      ),
    });
    const items = this.pagination.getCurrentItems();
    table.push(...items);

    const output =
      '\n' +
      colors.yellow('Babel timing - info for file:') +
      '\n' +
      colors.yellow(this.results.name) +
      '\n' +
      this.pagination.getInfo() +
      '\n' +
      table.toString() +
      '\n' +
      '← prev page  | → next page | ESC back to results list';

    this.diff.write(output);
  }
}

module.exports = PluginList;
