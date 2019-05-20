const Table = require('cli-table3');
var colors = require('colors/safe');
const Pagination = require('./Pagination');
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
    this.selected = 0;
    this.paginationSize = paginationSize;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Prepare data for rendering
    const pagedResults = this.results.map((result, index) => [
      index + 1,
      result.name,
      result.totalTime.toFixed(3),
    ]);

    this.pagination = new Pagination({
      items: pagedResults,
      itemsPerPage: paginationSize,
    });

    process.stdin.on('keypress', this.onKeyPress);
    this.render();
  }

  getSelectedEntryIndex() {
    const currentPage = this.pagination.getCurrentPage();
    return this.paginationSize * currentPage + this.selected;
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
      max: this.pagination.countItemsInCurrentPage() - 1,
    });
    this.render();
  }

  previousPage() {
    if (this.pagination.hasPreviousPage()) {
      this.pagination.previousPage();
      this.selected = 0;
      this.render();
    }
  }

  nextPage() {
    if (this.pagination.hasNextPage()) {
      this.pagination.nextPage();
      this.selected = 0;
      this.render();
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
      head: ['', 'File', 'Total time(ms)'].map(entry => colors.yellow(entry)),
    });
    const items = this.pagination.getCurrentItems();
    table.push(
      ...items.map((row, index) => {
        if (index === this.selected) {
          return row.map(entry => colors.yellow.underline(entry));
        }
        return row;
      })
    );

    const output =
      '\n' +
      colors.yellow('Babel timing - trasformed files') +
      '\n' +
      this.pagination.getInfo() +
      '\n' +
      table.toString() +
      '\n' +
      '← prev page  | → next page | ↑↓ select file | ↩ show file details';

    this.diff.write(output);
  }
}

module.exports = FileList;
