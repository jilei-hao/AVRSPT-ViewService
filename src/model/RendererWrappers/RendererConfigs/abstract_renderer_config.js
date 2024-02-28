import { BoundingBox, RGBAColor } from '../../Basics'

export class AbstractRendererConfig {
  constructor() {
    this.viewportBoundingBox = new BoundingBox();
    this.backgroundColor = new RGBAColor(0, 0, 0, 0);
    this.rendererType = "";
  }

  setViewportBoundingBox(xMin, xMax, yMin, yMax) {
    this.viewportBoundingBox.xMin = xMin;
    this.viewportBoundingBox.xMax = xMax;
    this.viewportBoundingBox.yMin = yMin;
    this.viewportBoundingBox.yMax = yMax;
  }

  getViewportBoundingBox() {
    return this.viewportBoundingBox;
  }

  getViewportBoundingBoxInArray() {
    return this.viewportBoundingBox.toArray();
  }

  getRendererType() {
    return this.rendererType;
  }

  getBackgroundInRGBA() {
    return this.backgroundColor.toArray();
  }
}