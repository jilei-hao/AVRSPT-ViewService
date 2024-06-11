import { AVRPDataServerHelper, AVRPGatewayHelper } from "@viewer/api_helpers";

export default class StudyDataLoader {
  constructor() {
    this._gwHelper = AVRPGatewayHelper.getInstance();
    this._dsHelper = AVRPDataServerHelper.getInstance();
    this._isLoading = false;
  }

  static instance = null;

  loadTPData = (tpHeader) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('data_loader_workers.js', import.meta.url), { type: 'module' });
  
      worker.onmessage = (event) => {
        console.log("[StudyDataLoader::loadTPData] worker.onmessage: ", event.data)
        // const data = event.data;
        // Process the data and resolve the promise
        // resolve(data);
      }
  
      worker.onerror = (error) => {
        // If there's an error, reject the promise
        console.log("[StudyDataLoader::loadTPData] error in worker: ", error);
        reject(error);
      }
  
      worker.postMessage({ tpHeader: tpHeader });
    });
  }

  static getInstance(gwHelper, dsHelper) {
    if (!StudyDataLoader.instance) {
      StudyDataLoader.instance = new StudyDataLoader(gwHelper, dsHelper);
    }
    return StudyDataLoader.instance;
  }
}