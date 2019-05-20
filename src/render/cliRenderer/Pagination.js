var chunkArray = require('lodash.chunk');

class Pagination {
  constructor({items = [], itemsPerPage = 10} = {}) {
    this.items = items;
    this.pagedItems = chunkArray(items, itemsPerPage);
    this.currentPage = 0;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getTotalPages() {
    return this.pagedItems.length;
  }

  getTotalEntriesInPage(pageNumber) {
    return this.pagedItems[pageNumber].length;
  }

  countItemsInPage(pageNumber) {
    return this.pagedItems[pageNumber].length;
  }

  countItemsInCurrentPage() {
    return this.countItemsInPage(this.getCurrentPage());
  }

  getCurrentItems() {
    return this.pagedItems[this.currentPage];
  }

  getInfo() {
    return (
      `${this.items.length} results | ` +
      `page ${this.getCurrentPage() + 1}/` +
      `${this.getTotalPages()}`
    );
  }

  hasPreviousPage() {
    return this.currentPage > 0;
  }

  hasNextPage() {
    return this.currentPage + 1 < this.getTotalPages();
  }

  previousPage() {
    if (this.hasPreviousPage()) {
      this.currentPage = this.currentPage - 1;
    }
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage = this.currentPage + 1;
    }
  }
}

module.exports = Pagination;
