class DataGroupHeader {
  constructor(jsonData) {
    this._name = jsonData.data_group_name;
    this._tpDataHeaders = [];
    jsonData.time_point_data.forEach((tpHeader) => {
      const tpDataHeader = {
        timePoint: tpHeader.time_point,
        primaryIndex: tpHeader.primary_index,
        primaryIndexName: tpHeader.primary_index_name,
        primaryIndexDesc: tpHeader.primary_index_desc,
        secondaryIndex: tpHeader.secondary_index,
        secondaryIndexName: tpHeader.secondary_index_name,
        secondaryIndexDesc: tpHeader.secondary_index_desc,
        dataServerId: tpHeader.data_server_id
      };
      this._tpDataHeaders.push(tpDataHeader);
    });
  }
}

export default class StudyDataHeader {
  constructor(studyId, jsonData) {
    console.log("[StudyDataHeader::constructor] jsonData", jsonData);
    this._studyId = studyId;
    this._dataGroupHeaders = [];
    jsonData.forEach((dataGroup) => {
      this._dataGroupHeaders.push(new DataGroupHeader(dataGroup));
    });
  }
};