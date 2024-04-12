export default class AVRPDataServerHelper {
  constructor() {
    this._studyId = null;
  }

  static instance = null;

  static getInstance() {
    console.log("[AVRPDataServerHelper::getInstance] ");
    if (!AVRPDataServerHelper.instance) {
      AVRPDataServerHelper.instance = new AVRPDataServerHelper();
    }
    return AVRPDataServerHelper.instance;
  }
}