export function createTimePointData (tp, volumeMain, volumeSeg, modelSL, modelML, coSurface) {
  return {
    tp: tp,
    volumeMain: volumeMain,
    volumeSegmentation: volumeSeg,
    singleLabelModel: modelSL,
    multiLabelModel: modelML,
    coaptationSurface: coSurface,
  };
};