'use strict';

class Provider {
  constructor() {
    if (this.constructor === Provider) throw new Error("Abstract classes can't be instantiated.");
  }

  init() {
    throw new Error('Method "init()" must be implemented.');
  }

  getMetadataList() {
    throw new Error('Method "getMetadataList()" must be implemented.');
  }
}

module.exports = { Provider };
