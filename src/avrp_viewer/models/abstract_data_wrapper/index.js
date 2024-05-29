export default class AbstractDataWrapper {
  constructor() {
    this._ready = false;
    this._data = null;
  }

  get ready() {
    return this._ready;
  }

  get data() {
    return this._data;
  }
}