const Table = require('cli-table3');

class PluginList {
  constructor({results = {}, onBack = () => {}, diff} = {}) {
    this.results = results;
    this.onBack = onBack;
    this.diff = diff;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Make data suitable for rendering
    this.pagedPlugins = this.results.plugins.map(result => [
      result.plugin,
      result.time.toFixed(3),
      result.visits,
      result.timePerVisit.toFixed(3),
    ]);

    process.stdin.on('keypress', this.onKeyPress);
    this.render();
  }

  onKeyPress(ch, key) {
    if (!key) {
      return;
    }

    switch (key.name) {
      case 'escape':
      case 'left':
        return this.onBack();

      case 'c': {
        if (key.ctrl) {
          this.stop();
          process.exit();
        }
        return;
      }
    }
  }

  clear() {
    this.diff.clear();
  }

  stop() {
    process.stdin.removeAllListeners('keypress');
  }

  render() {
    const table = new Table({
      head: ['pluginAlias', 'time(ms)', 'visits', 'time/visit(ms)'],
    });
    table.push(...this.pagedPlugins);

    const output =
      `File: ${this.results.name}` +
      '\n' +
      table.toString() +
      '\n' +
      '← ESC back to result list';

    this.diff.write(output);
  }
}

module.exports = PluginList;
