import { AbstractRendererConfig } from './abstract_renderer_config';

export class ModelRendererConfig extends AbstractRendererConfig {
  constructor() {
    super();
    this.rendererType = "Model";
  }
};