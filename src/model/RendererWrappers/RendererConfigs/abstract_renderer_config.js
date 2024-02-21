import { BoundingBox } from '../../Basics'

export class AbstractRendererConfig {
  constructor() {
    this.viewPortBoundingBox = new BoundingBox();
    this.rendererType = "";
  }

  setViewPortBoundingBox(xMin, xMax, yMin, yMax) {
    this.viewPortBoundingBox.xMin = xMin;
    this.viewPortBoundingBox.xMax = xMax;
    this.viewPortBoundingBox.yMin = yMin;
    this.viewPortBoundingBox.yMax = yMax;
  }

  getViewPortBoundingBox() {
    return this.viewPortBoundingBox;
  }

  getViewPortBoundingBoxInArray() {
    return this.viewPortBoundingBox.toArray();
  }

  getRendererType() {
    return this.rendererType;
  }

  getBackgroundInRGBA() {
    return 
  }
}