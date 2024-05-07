/*
  * Abstract class for a layer.
  * A layer stores a group of props that can be rendered or hide together
  * A layer is created and owned by a view
  * Layers are the building blocks of view-modes
*/

export default class AbstractLayer {
  constructor() {
    this._visible = true;
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    this._visible = value;
  }
}