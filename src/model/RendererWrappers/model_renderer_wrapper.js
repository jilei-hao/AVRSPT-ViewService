import { AbstractRendererWrapper } from './abstract_renderer_wrapper.js';
import { ModelRendererConfig } from './RendererConfigs';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer.js';

export class ModelRendererWrapper extends AbstractRendererWrapper {
  constructor() {
    super();
    this.config = new ModelRendererConfig();
    this.renderer = vtkRenderer.newInstance();
  }

  // Layer management
  addLayer(layer_id, layer) {
    super.addLayer(layer_id, layer);
  }

  removeLayer(id) {
    super.removeLayer(id);
  }

  findLayer(layer) {
    super.findLayer(layer);
  }

  // Config management
  setConfig(rendererConfig) {
    this.config = rendererConfig;
    this._configureRenderer();
  }

  getConfig() {
    return this.config;
  }

  _configureRenderer() {
    this.renderer.setBackground(0, 0, 0, 1);
    this.renderer.setViewport(...this.config.getViewportBoundingBoxInArray());
  }

  // Renderer
  getRenderer() {
    return this.renderer;
  }

  // Camera
  resetCamera() {
    this.renderer.resetCamera();
  }

  
}