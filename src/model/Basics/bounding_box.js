export class BoundingBox {
  constructor() {
    this.xMin = 0;
    this.xMax = 0;
    this.yMin = 0;
    this.yMax = 0;
  }

  toArray() {
    return [this.xMin, this.xMax, this.yMin, this.yMax];
  }
}