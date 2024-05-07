
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

  static composeDataServerURL(dsid) {
    return `${DATA_SERVER_URL}/data?id=${dsid}`;
  }

  static async getData(dsid) {
    return fetch(AVRPDataServerHelper.composeDataServerURL(dsid), {
      method: 'GET',
      headers: {},
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.arrayBuffer();
    }).catch((error) => {
      console.error(`Error connecting to the server: ${error}`);
      return {
        success: false,
        message: `Error connecting to the server: ${error}`,
      };
    });
  }
}