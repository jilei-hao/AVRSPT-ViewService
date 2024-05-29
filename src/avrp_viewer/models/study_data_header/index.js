export function createStudyDataHeader(studyId, json) {
  return {
    studyId: studyId,
    tpHeaders: json.map((tpHeader) => {
      return {
        tp: tpHeader.time_point,
        dataGroupHeaders: tpHeader.data_groups,
      }
    })
  }
}

export function getDataGroupHeaderByName(tpHeader, dataGroupName) {
  return tpHeader.dataGroupHeaders.find((dataGroupHeader) => {
    return dataGroupHeader.data_group_name === dataGroupName;
  });
}