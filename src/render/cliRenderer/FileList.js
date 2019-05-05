var differ = require('ansi-diff-stream');
var keypress = require('keypress');
const Table = require('cli-table3');
var colors = require('colors/safe');
var chunkArray = require('lodash.chunk');
const {valueInRange} = require('../../utils');

class FileList {
  constructor({
    results = [],
    paginationSize = 10,
    onSelected = () => {},
    onExit = () => {},
  } = {}) {
    this.results = results;
    this.onSelected = onSelected;
    this.onExit = onExit;
    this.paginationSize = paginationSize;
    this.selected = 0;
    this.page = 0;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Make data suitable for rendering
    this.pagedResults = this.results.map((result, index) => [
      result.name,
      result.totalTime.toFixed(3),
    ]);
    this.pagedResults = chunkArray(this.pagedResults, paginationSize);

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

  getTotalPages() {
    return this.pagedResults.length;
  }

  getTotalEntriesInPage(pageNumber) {
    return this.pagedResults[pageNumber].length;
  }

  getSelectedEntryIndex() {
    return this.paginationSize * this.page + this.selected;
  }

  onKeyPress(ch, key) {
    if (!key) {
      return;
    }

    switch (key.name) {
      case 'up':
        return this.moveSelectionUp();

      case 'down':
        return this.moveSelectionDown();

      case 'left':
        return this.previousPage();

      case 'right':
        return this.nextPage();

      case 'return': {
        this.onSelected(this.getSelectedEntryIndex());
        return;
      }

      case 'c': {
        if (key.ctrl) {
          this.onExit(this.getSelectedEntryIndex());
          this.stop();
          process.exit();
        }
        return;
      }
    }
  }

  moveSelectionUp() {
    this.selected = valueInRange(this.selected - 1, {
      min: 0,
    });
    this.render();
  }

  moveSelectionDown() {
    this.selected = valueInRange(this.selected + 1, {
      max: this.getTotalEntriesInPage(this.page) - 1,
    });
    this.render();
  }

  previousPage() {
    this.page = valueInRange(this.page - 1, {
      min: 0,
    });
    this.selected = 0;
    this.render();
  }

  nextPage() {
    this.page = valueInRange(this.page + 1, {
      max: this.getTotalPages() - 1,
    });
    this.selected = 0;
    this.render();
  }

  clear() {
    this.diff.clear();
  }

  stop() {
    process.stdin.removeListener('keypress', this.onKeyPress);
    process.stdin.pause();
  }

  render() {
    const table = new Table({head: ['File name', 'Total time(ms)']});
    const resultPage = this.pagedResults[this.page];

    table.push(
      ...resultPage.map((row, index) => {
        if (index === this.selected) {
          return row.map(entry => colors.green(entry));
        }
        return row;
      })
    );
    this.diff.write(
      `${this.results.length} results | page ${this.page +
        1}/${this.getTotalPages()}` +
        '\n' +
        table.toString() +
        '\n' +
        '← prev page  | → next page | ↑↓ select file | ↩ show entry details'
    );
  }
}

module.exports = FileList;
