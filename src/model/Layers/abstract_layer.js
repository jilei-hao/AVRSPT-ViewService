export class AbstractLayer {
  constructor() {
  }

  setData(_data) {
    this.data = _data;
  }

  setDMP(_dmp) {
    this.dmp = _dmp;
  }

  getDMP() {
    return this.dmp;
  }

  setLayerConfig(_layerConfig) {
    this.layerConfig = _layerConfig;
  }
}