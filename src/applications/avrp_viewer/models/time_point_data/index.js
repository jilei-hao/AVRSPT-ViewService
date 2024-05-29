export function createTimePointData (tp, volume, modelSL, modelML, coSurface) {
  return {
    tp: tp,
    volume: volume,
    singleLabelModel: modelSL,
    multiLabelModel: modelML,
    coaptationSurface: coSurface,
  };
};