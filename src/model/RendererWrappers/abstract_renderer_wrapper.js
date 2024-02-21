export class AbstractRendererWrapper {
  constructor() {
    this.layers = new Map();
  }

  // Layer management
  addLayer(layer_id, layer) {
    this.layers.set(layer_id, layer);
  }

  removeLayer(id) {
    this.layers.delete(id);
  }

  findLayer(id) {
    return this.layers.get(id);
  }

  // Config management
  setConfig(rendererConfig) {
    throw new Error('[AbstractRenderer::setConfig()] Method not implemented');
  }

  _configureRenderer() {
    throw new Error('[AbstractRenderer::#configureRenderer()] Method not implemented');
  }

  // Renderer
  getRenderer() {
    throw new Error('[AbstractRenderer::getRenderer()] Method not implemented');
  }

  resetCamera() {
    throw new Error('[AbstractRenderer::resetCamera()] Method not implemented');
  }
}