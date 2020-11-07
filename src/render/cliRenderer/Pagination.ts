import chunkArray from 'lodash.chunk';

export default class Pagination<Item> {
  items: Item[][];
  itemsPerPage: number;
  pagedItems: Item[][][];
  currentPage: number;

  constructor({
    items = [],
    itemsPerPage = 10,
  }: {
    items: Item[][];
    itemsPerPage: number;
  }) {
    this.items = items;
    this.itemsPerPage = itemsPerPage;
    this.pagedItems = chunkArray(items, itemsPerPage);
    this.currentPage = 0;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getTotalPages() {
    return this.pagedItems.length;
  }

  getTotalEntriesInPage(pageNumber: number) {
    return this.pagedItems[pageNumber].length;
  }

  countItemsInPage(pageNumber: number) {
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

  goToItemPage(itemIndex: number = -1) {
    if (itemIndex < 0 || itemIndex > this.items.length) {
      return;
    }

    this.currentPage = Math.floor(itemIndex / this.itemsPerPage);
  }
}
