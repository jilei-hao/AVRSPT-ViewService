// generate a random rgb
function randomRGB() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
}

export default class AVRPViewModel {
  constructor(id, pctTop, pctLeft, pctWidth, pctHeight, rgbBackgroundClr = randomRGB()) {
    this.m_Id = id;
    this.m_PctTop = pctTop;
    this.m_PctLeft = pctLeft;
    this.m_PctWidth = pctWidth;
    this.m_PctHeight = pctHeight;
    this.m_RGBBackgroundColor = rgbBackgroundClr;
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

  GetBackgroundColor() {
    return this.m_RGBBackgroundColor;
  }

  Dispose() {
    console.log("[AVRPViewModel::Dispose] ");
  }
}