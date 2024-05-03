export default class TimePointData {
  constructor(tp) {
    console.log("[TimePointData::constructor] ")
    this._tp = tp;
    this._volume = null; // volume
    this._singleLabelModel = null; // polydata
    this._multiLabelModel = new Map(); // label to polydata
    this._coaptationSurface = new Map(); // position to polydata
  }

  get tp() {
    return this._tp;
  }

  get volume() {
    return this._volume;
  }

  set volume(value) {
    this._volume = value;
  }

  get singleLabelModel() {
    return this._singleLabelModel;
  }

  set singleLabelModel(value) {
    this._singleLabelModel = value;
  }

  get multiLabelModel() {
    return this._multiLabelModel;
  }

  set multiLabelModel(value) {
    this._multiLabelModel = value;
  }

  get coaptationSurface() {
    return this._coaptationSurface;
  }

  set coaptationSurface(value) {
    this._coaptationSurface = value;
  }

}


export {
  TimePointData,
}