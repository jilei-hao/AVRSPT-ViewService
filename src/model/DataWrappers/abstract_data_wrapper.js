export default class AbstractDataWrapper {
  constructor() {
    this.m_Ready = false;
  }

  IsOfType(type) {
    return this instanceof type;
  }

  IsDataReady() {
    return this.m_Ready;
  }

  // takes an AbstractDataAdapter and loads data into the wrapper
  Load(dataAdapter) {
    throw new Error("Abstract method Load not implemented");
  }
}