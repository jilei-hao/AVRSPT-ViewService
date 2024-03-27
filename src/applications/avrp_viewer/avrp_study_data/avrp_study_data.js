import AVRPTimePointData from './avrp_timepoint_data';

// class represents the data for a single AVRP study
export default class AVRPStudyData {
  contructor (caseId, gwHelper, dsHelper) {
    console.log(`[AVRPStudyData(${caseId})]: constructor `);
    this.caseId = caseId;
    this.gwHelper = gwHelper; // api helper for connecting to the gateway
    this.dsHelper = dsHelper; // api helper for connecting to the data server
    this.tpDataArray = [];

    gwHelper.getStudyDataHeader(studyId).then((studyHeader) => {
      const tpArray = Array.from(
        { length: studyHeader.numberOfTimePoints }, (_, i) => i + 1);
      Promise.all(tpArray.map((tp) => fetchTimePointData(studyHeader.tpDataHeader[tp])))
        .then((_tpDataArr) => {
          this.tpDataArray = _tpDataArr;
        });
    });
  }

  fetchTimePointData(tpDataHeader) {
    return new Promise((resolve, reject) => {
      const tpData = new AVRPTimePointData(tpDataHeader, this.dsHelper);
      resolve(tpData);
    });
  };




}