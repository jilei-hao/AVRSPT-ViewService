// This is the highest level of data management for the AVRP Viewer application.
// Manager owns data wrappers and provides data to the application.


// temporary import (to be replaced by query to backend)
import { studyData, studyHeaders } from '../../../model/studies';

export default class AVRPDataManager {
  constructor (studyId) {
    this.studyId = studyId;
    this.loadingProgress = 0; // 0-100
    this.studyHeader = studyHeaders[studyId];

    // immediately start loading
    this.loadStudyData();
  }

  async loadStudyData() {
    this.unifiedModel = new UnifiedModel(this.studyId, this.studyHeader.nT);
    this.unifiedModel.loadFromRemote();
    this.coaptationSurface = new CoaptationSurface(this.studyId, this.studyHeader.nT);
    this.coaptationSurface.loadFromRemote();
  }

  async getUnifiedModel(tp) {
    return this.unifiedModel.getModel(tp);
  }

  async getCoaptationSurface(tp) {
    return this.coaptationSurface.getModel(tp);
  }

  getLoadingProgress() {
    return this.unifiedModel.getLoadingProgress() * 0.7 
      +  this.coaptationSurface.getLoadingProgress() * 0.3;
  }
  
}