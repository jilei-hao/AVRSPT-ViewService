const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

const DEV_GATEWAY_USERNAME = import.meta.env.VITE_DEV_GATEWAY_USERNAME;
const DEV_GATEWAY_PASSWORD = import.meta.env.VITE_DEV_GATEWAY_PASSWORD;

export default class AVRPGatewayHelper {
  constructor() {
    console.log("[AVRPGatewayHelper::constructor] GATEWAY_URL: ", GATEWAY_URL);

    fetch(`${GATEWAY_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: DEV_GATEWAY_USERNAME,
        password: DEV_GATEWAY_PASSWORD
      })
    }).then((res) => {
      return res.json();
    }).then((data) => {
      console.log("[AVRPGatewayHelper::constructor] login response: ", data);
      this._token = data.token;
    }).catch((error) => {
      console.error(`Error connecting to the server: ${error}`);
    });
    
  }

  getStudyDataHeader(studyId) {
    console.log("[AVRPGatewayHelper::getStudyDataHeader] studyId: ", studyId)

    return Promise.resolve({});
  }

  static instance = null;

  static getInstance() {
    console.log("[AVRPGatewayHelper::getInstance] ");
    if (!AVRPGatewayHelper.instance) {
      AVRPGatewayHelper.instance = new AVRPGatewayHelper();
    }
    return AVRPGatewayHelper.instance;
  }
}