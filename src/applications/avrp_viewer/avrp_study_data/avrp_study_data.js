import { AVRPTimepointData } from './avrp_timepoint_data';

// class represents the data for a single AVRP study
export default class AVRPStudyData {
  constructor(studyId, gwHelper, dsHelper) {
    console.log(`[AVRPStudyData(${studyId})]: constructor `);
    this.studyId = studyId;
    this.gwHelper = gwHelper; // api helper for connecting to the gateway
    this.dsHelper = dsHelper; // api helper for connecting to the data server
    this.tpDataArray = [];
    gwHelper.getStudyDataHeader(studyId).then((studyHeader) => {
      const tpArray = Array.from(
        { length: studyHeader.numberOfTimePoints }, (_, i) => i + 1);
      Promise.all(tpArray.map((tp) => this.fetchTimePointData(studyHeader.tpDataHeader[tp])))
        .then((_tpDataArr) => {
          this.tpDataArray = _tpDataArr;
        });
    });
  }

  static instance = null;

  static getInstance(studyId, gwHelper, dsHelper) {
    console.log(`[AVRPStudyData(${studyId})]: getInstance `);
    if (!AVRPStudyData.instance) {
      AVRPStudyData.instance = new AVRPStudyData(studyId, gwHelper, dsHelper);
    }
    return AVRPStudyData.instance;
  }

  fetchTimePointData(tpDataHeader) {
    return new Promise((resolve, reject) => {
      const tpData = new AVRPTimePointData(tpDataHeader, this.dsHelper);
      resolve(tpData);
    });
  }
}