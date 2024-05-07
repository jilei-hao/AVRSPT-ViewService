class DataGroupHeader {
  constructor(jsonData) {
    this._name = jsonData.data_group_name;
    this._primaryIndex = jsonData.primary_index,
    this._primaryIndexName = jsonData.primary_index_name,
    this._primaryIndexDesc = jsonData.primary_index_desc,
    this._secondaryIndex = jsonData.secondary_index,
    this._secondaryIndexName = jsonData.secondary_index_name,
    this._secondaryIndexDesc = jsonData.secondary_index_desc,
    this._dsid = jsonData.data_server_id
  }

  get name() {
    return this._name;
  }

  get primaryIndex() {
    return this._primaryIndex;
  }

  get primaryIndexName() {
    return this._primaryIndexName;
  }

  get primaryIndexDesc() {
    return this._primaryIndexDesc;
  }

  get secondaryIndex() {
    return this._secondaryIndex;
  }

  get secondaryIndexName() {
    return this._secondaryIndexName;
  }

  get secondaryIndexDesc() {
    return this._secondaryIndexDesc;
  }

  get dsid() {
    return this._dsid;
  }
}

class TimePointHeader {
  constructor(jsonData) {
    this._tp = jsonData.time_point;
    this._dataGroupHeaders = [];
    jsonData.data_groups.forEach((dataGroup) => {
      this._dataGroupHeaders.push(new DataGroupHeader(dataGroup));
    });
  }

  get tp() {
    return this._tp;
  }

  get dataGroupHeaders() {
    return this._dataGroupHeaders;
  }

  getDataGroupHeaderByName(name) {
    return this._dataGroupHeaders.find((dataGroupHeader) => {
      return dataGroupHeader.name === name;
    });
  }
}

export default class StudyDataHeader {
  constructor(studyId, jsonData) {
    this._studyId = studyId;
    this._tpHeaders = [];
    jsonData.forEach((tpHeader) => {
      this._tpHeaders.push(new TimePointHeader(tpHeader));
    });
  }

  get studyId() {
    return this._studyId;
  }

  get tpHeaders() {
    return this._tpHeaders;
  }
};