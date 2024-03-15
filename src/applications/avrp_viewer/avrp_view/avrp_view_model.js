export default class AVRPViewModel {
  constructor(id, pctTop, pctLeft, pctWidth, pctHeight) {
    this.m_Id = id;
    this.m_PctTop = pctTop;
    this.m_PctLeft = pctLeft;
    this.m_PctWidth = pctWidth;
    this.m_PctHeight = pctHeight;
  }

  GetId() {
    return this.m_Id;
  }

  GetGeometry() {
    return {
      pctTop: this.m_PctTop,
      pctLeft: this.m_PctLeft,
      pctWidth: this.m_PctWidth,
      pctHeight: this.m_PctHeight
    };
  }

  Dispose() {
    console.log("[AVRPViewModel::Dispose] ");
  }
}