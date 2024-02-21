import { AbstractLayer } from './abstract_layer.js';

class ModelLayer extends AbstractLayer{
  constructor() {
    this.dmp = null;
  }

  setData(_data) {
    this.data = _data;
  }

  setDMP(_dmp) {
    this.dmp = _dmp;
  }
}