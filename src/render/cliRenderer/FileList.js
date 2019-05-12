const Table = require('cli-table3');
var colors = require('colors/safe');
var chunkArray = require('lodash.chunk');
const {valueInRange} = require('../../utils');

class FileList {
  constructor({
    results = [],
    paginationSize = 10,
    onSelected = () => {},
    diff,
  } = {}) {
    this.results = results;
    this.onSelected = onSelected;
    this.diff = diff;
    this.paginationSize = paginationSize;
    this.selected = 0;
    this.page = 0;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Prepare data for rendering
    this.pagedResults = this.results.map((result, index) => [
      index + 1,
      result.name,
      result.totalTime.toFixed(3),
    ]);
    this.pagedResults = chunkArray(this.pagedResults, paginationSize);

    process.stdin.on('keypress', this.onKeyPress);
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
    process.stdin.removeAllListeners('keypress');
  }

  render() {
    const table = new Table({head: ['', 'File', 'Total time(ms)']});
    const resultPage = this.pagedResults[this.page];
    table.push(
      ...resultPage.map((row, index) => {
        if (index === this.selected) {
          return row.map(entry => colors.green(entry));
        }
        return row;
      })
    );

    const output =
      `${this.results.length} results | page ${this.page +
        1}/${this.getTotalPages()}` +
      '\n' +
      table.toString() +
      '\n' +
      '← prev page  | → next page | ↑↓ select file | ↩ show entry details';

    this.diff.write(output);
  }
}

module.exports = FileList;
