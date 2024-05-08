/*
  * AbstractLayerModel
  * a layer model defines how to render a layer
*/

export default class AbstractLayer {
  constructor() {
    this._props = [];
    this._visible = true;
  }

  get props() {
    return this._props;
  }

  set props(value) {
    this._props = value;
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    this._visible = value;
  }
}