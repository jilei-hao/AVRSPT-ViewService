const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

export default class AVRPGatewayHelper {
  constructor() {
    console.log("[AVRPGatewayHelper::constructor] GATEWAY_URL: ", GATEWAY_URL);
    this._token = null;
  }

  login(username, password) {
    console.log("[AVRPGatewayHelper::login] username: ", username, ", password: ", password);
  
    return fetch(`${GATEWAY_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => {
      console.log("[AVRPGatewayHelper::login] login response: ", data);
      this._token = data.token;
      return {
        success: true,
        message: 'Login successful',
      };
    })
    .catch((error) => {
      console.error(`Error connecting to the server: ${error}`);
      return {
        success: false,
        message: `Error connecting to the server: ${error}`,
      };
    });
  }

  static instance = null;

  static getInstance() {
    if (!AVRPGatewayHelper.instance) {
      AVRPGatewayHelper.instance = new AVRPGatewayHelper();
    }
    return AVRPGatewayHelper.instance;
  }

  // api call methods

  getCaseStudyHeaders() {
    console.log("[AVRPGatewayHelper::getCaseStudyHeaders] ");
    return fetch(`${GATEWAY_URL}/case-studies-vs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then((data) => {
      console.log("[AVRPGatewayHelper::getCaseStudyHeaders] data: ", data);
      return data;
    });
  }

  getStudyDataHeader(studyId) {
    console.log("[AVRPGatewayHelper::getStudyDataHeader] studyId: ", studyId)

    return fetch(`${GATEWAY_URL}/study-data-headers-vs?study_id=${studyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then((data) => {
      console.log('[AVRPGatewayHelper::getStudyDataHeader] data: ', data);
    });
  }
}