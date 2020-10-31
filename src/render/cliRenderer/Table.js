const CliTable = require('cli-table3');
const colors = require('colors/safe');
const defaults = require('lodash.defaults');
const Pagination = require('./Pagination');
const { valueInRange } = require('../../utils');

class Table {
  constructor(props = {}) {
    this.props = defaults({}, props, {
      title: '',
      entries: [],
      entriesMap: [],
      selectable: false,
      selected: 0,
      paginationSize: 10,
      onSelected: () => {},
      onSelectedCommandInfo: '',
      onEscape: () => {},
      onEscapeCommandInfo: '',
      onRender: () => {},
    });

    this.selectedInCurrentPage =
      this.props.selected % this.props.paginationSize;
    this.onKeyPress = this.onKeyPress.bind(this);

    // Prepare data for rendering
    this.tableHead = [
      '',
      ...this.props.entriesMap.map(entry => entry[0]),
    ].map(entry => colors.yellow(entry));

    const pagedEntries = this.props.entries.map((result, index) => [
      index + 1,
      ...this.props.entriesMap.map(entry => entry[1](result)),
    ]);

    this.pagination = new Pagination({
      items: pagedEntries,
      itemsPerPage: this.props.paginationSize,
    });
    this.pagination.goToItemPage(this.props.selected);

    process.stdin.on('keypress', this.onKeyPress);
    this.render();
  }

  getSelectedEntryIndex() {
    const currentPage = this.pagination.getCurrentPage();
    return this.props.paginationSize * currentPage + this.selectedInCurrentPage;
  }

  onKeyPress(ch, key) {
    if (!key) {
      return;
    }

    switch (key.name) {
      case 'up':
        return this.props.selectable && this.moveSelectionUp();

      case 'down':
        return this.props.selectable && this.moveSelectionDown();

      case 'left':
        return this.previousPage();

      case 'right':
        return this.nextPage();

      case 'escape':
        return this.props.onEscape();

      case 'return': {
        this.props.onSelected(this.getSelectedEntryIndex());
        return;
      }

      case 'c': {
        if (key.ctrl) {
          this.unmount();
          process.exit();
        }
        return;
      }
    }
  }

  moveSelectionUp() {
    this.selectedInCurrentPage = valueInRange(this.selectedInCurrentPage - 1, {
      min: 0,
    });
    this.render();
  }

  moveSelectionDown() {
    this.selectedInCurrentPage = valueInRange(this.selectedInCurrentPage + 1, {
      max: this.pagination.countItemsInCurrentPage() - 1,
    });
    this.render();
  }

  previousPage() {
    if (this.pagination.hasPreviousPage()) {
      this.pagination.previousPage();
      this.selectedInCurrentPage = 0;
      this.render();
    }
  }

  nextPage() {
    if (this.pagination.hasNextPage()) {
      this.pagination.nextPage();
      this.selectedInCurrentPage = 0;
      this.render();
    }
  }

  getCommandsInfo() {
    return [
      '← prev page',
      '→ next page',
      this.props.selectable &&
        this.props.onSelectedCommandInfo &&
        `↑↓ ${this.props.onSelectedCommandInfo}`,
      this.props.onEscapeCommandInfo && `ESC ${this.props.onEscapeCommandInfo}`,
    ]
      .filter(entry => Boolean(entry))
      .join(' | ');
  }

  unmount() {
    process.stdin.removeAllListeners('keypress');
  }

  render() {
    let items = this.pagination.getCurrentItems();

    // Highlight selected entry
    if (this.props.selectable) {
      items = items.map((row, index) => {
        if (index === this.selectedInCurrentPage) {
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
      colors.yellow(this.props.title) +
      '\n' +
      this.pagination.getInfo() +
      '\n' +
      table.toString() +
      '\n' +
      this.getCommandsInfo();

    this.props.onRender(output);
  }
}

module.exports = Table;
