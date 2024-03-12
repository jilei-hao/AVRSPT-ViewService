import AbstractDataWrapper from './abstract_data_wrapper.js';

export default class ModelDataWrapper extends AbstractDataWrapper {
  constructor() {
    super();
    this.m_ModelMap = new Map(); // key = label, value = mesh
  }

  LoadFromRemote() {
  }