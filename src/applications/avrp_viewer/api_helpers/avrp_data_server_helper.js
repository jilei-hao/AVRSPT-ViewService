
const DATA_SERVER_URL = import.meta.env.VITE_DATA_SERVER_URL;


export default class AVRPDataServerHelper {
  constructor() {
    console.log("[AVRPDataServerHelper::constructor] DATA_SERVER_URL: ", DATA_SERVER_URL);
  }

  static instance = null;

  static getInstance() {
    if (!AVRPDataServerHelper.instance) {
      AVRPDataServerHelper.instance = new AVRPDataServerHelper();
    }
    return AVRPDataServerHelper.instance;
  }

  static ComposeDataServerURL(dsid) {
    return `${DATA_SERVER_URL}/data?id=${dsid}`;
  }
}