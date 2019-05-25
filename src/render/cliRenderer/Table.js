const CliTable = require('cli-table3');
const colors = require('colors/safe');
const Pagination = require('./Pagination');
const {valueInRange} = require('../../utils');

class Table {
  constructor({
    title = '',
    entries = [],
    entriesMap = [],
    selectable = false,
    selected = 0,
    paginationSize = 10,
    onSelected = () => {},
    onSelectedInfo = '',
    onEscape = () => {},
    onEscapeInfo = '',
    diff,
  } = {}) {
    this.title = title;
    this.entries = entries;
    this.selectable = selectable;
    this.selected = selected % paginationSize;
    this.paginationSize = paginationSize;
    this.onSelected = onSelected;
    this.onSelectedInfo = onSelectedInfo;
    this.onEscape = onEscape;
    this.onEscapeInfo = onEscapeInfo;
    this.diff = diff;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Prepare data for rendering
    this.tableHead = ['', ...entriesMap.map(entry => entry[0])].map(entry =>
      colors.yellow(entry)
    );

    const pagedentries = this.entries.map((result, index) => [
      index + 1,
      ...entriesMap.map(entry => entry[1](result)),
    ]);

    this.pagination = new Pagination({
      items: pagedentries,
      itemsPerPage: paginationSize,
    });
    this.pagination.goToItemPage(selected);

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
        return this.selectable && this.moveSelectionUp();

      case 'down':
        return this.selectable && this.moveSelectionDown();

      case 'left':
        return this.previousPage();

      case 'right':
        return this.nextPage();

      case 'escape':
        return this.onEscape();

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

  getCommandsInfo() {
    return [
      '← prev page',
      '→ next page',
      this.selectable && this.onSelectedInfo && `↑↓ ${this.onSelectedInfo}`,
      this.onEscapeInfo && `ESC ${this.onEscapeInfo}`,
    ]
      .filter(entry => Boolean(entry))
      .join(' | ');
  }

  clear() {
    this.diff.clear();
  }

  stop() {
    process.stdin.removeAllListeners('keypress');
  }

  render() {
    let items = this.pagination.getCurrentItems();

    // Highlight selected entry
    if (this.selectable) {
      items = items.map((row, index) => {
        if (index === this.selected) {
          return row.map(entry => colors.yellow.underline(entry));
        }
        return row;
      });
    }

    const table = new CliTable({
      head: this.tableHead,
    });

    table.push(...items);

    const output =
      '\n' +
      colors.yellow(this.title) +
      '\n' +
      this.pagination.getInfo() +
      '\n' +
      table.toString() +
      '\n' +
      this.getCommandsInfo();

    this.diff.write(output);
  }
}

module.exports = Table;
