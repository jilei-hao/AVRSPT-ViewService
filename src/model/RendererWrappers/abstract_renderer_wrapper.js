export class AbstractRendererWrapper {
  constructor() {
    this.renderer = null;
    this.config = null;
    this.layers = [];
  }

  // Layer management
  addLayer(layer) {
    throw new Error('[AbstractRenderer::addLayer()] Method not implemented');
  }

  removeLayer(layer) {
    throw new Error('[AbstractRenderer::removeLayer()] Method not implemented');
  }

  findLayer(layer) {
    throw new Error('[AbstractRenderer::findLayer()] Method not implemented');
  }

  // Config management
  setConfig(rendererConfig) {
    throw new Error('[AbstractRenderer::setConfig()] Method not implemented');
  }

  // Renderer
  getRenderer() {
    throw new Error('[AbstractRenderer::getRenderer()] Method not implemented');
  }
}