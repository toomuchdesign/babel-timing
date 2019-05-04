var differ = require('ansi-diff-stream');
var keypress = require('keypress');
const Table = require('cli-table3');

class PluginList {
  constructor({results = {}, onBack = () => {}, onExit = () => {}} = {}) {
    this.results = results;
    this.onBack = onBack;
    this.onExit = onExit;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Make data suitable for rendering
    this.pagedPlugins = this.results.plugins.map(result => [
      result.plugin,
      result.time.toFixed(3),
      result.visits,
      result.timePerVisit.toFixed(3),
    ]);

    // Init ansi-diff-stream
    var diff = differ();
    diff.pipe(process.stdout);
    this.diff = diff;

    // Make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);
    process.stdin.on('keypress', this.onKeyPress);
    process.stdin.setRawMode(true);
    process.stdin.resume();
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
          this.onExit();
          this.stop();
        }
        return;
      }
    }
  }

  clear() {
    this.diff.clear();
  }

  stop() {
    process.stdin.removeListener('keypress', this.onKeyPress);
    this.diff.reset();
    process.stdout;
    process.stdin.pause();
  }

  render() {
    const table = new Table({
      head: ['pluginAlias', 'time(ms)', 'visits', 'time/visit(ms)'],
    });
    table.push(...this.pagedPlugins);
    this.diff.write(table.toString() + '\n' + '← ESC back to result list');
  }
}

module.exports = PluginList;
