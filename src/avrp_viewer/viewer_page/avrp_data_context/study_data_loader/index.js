import { AVRPDataServerHelper, AVRPGatewayHelper } from "@viewer/api_helpers";
import { getDataGroupHeaderByName, createTimePointData } from "@viewer/models";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";

const readEntryAsPolyData = async (entry) => {
  const reader = vtkXMLPolyDataReader.newInstance();

  const binary = await AVRPDataServerHelper.getData(entry.data_server_id);

  console.time("parsePolyData");
  reader.parseAsArrayBuffer(binary);
  console.timeEnd("parsePolyData");

  return {
    primary_index: entry.primary_index_desc,
    secondary_index: entry.secondary_index_desc,
    data: reader.getOutputData(0),
  };
};

const readEntryAsImageData = async (entry) => {
  const reader = vtkXMLImageDataReader.newInstance();

  const binary = await AVRPDataServerHelper.getData(entry.data_server_id);

  console.time("parseImageData");
  reader.parseAsArrayBuffer(binary);
  console.timeEnd("parseImageData");

  return {
    primary_index: entry.primary_index_desc,
    secondary_index: entry.secondary_index_desc,
    data: reader.getOutputData(0),
  };
};

export default class StudyDataLoader {
  constructor() {
    this._gwHelper = AVRPGatewayHelper.getInstance();
    this._dsHelper = AVRPDataServerHelper.getInstance();
    this._isLoading = false;
  }

  static instance = null;

  loadTPData = async (tpHeader) => {
    console.log(`[DataLoaderWorker::loadTPData] tp[${tpHeader.tp}] started`);
  
    const modelSLPromises = getDataGroupHeaderByName(tpHeader, "model-sl")
      .data_group_entries.map((entry) => {
        return readEntryAsPolyData(entry);
      });
    const modelMLPromises = getDataGroupHeaderByName(tpHeader, "model-ml")
      .data_group_entries.map((entry) => {
        return readEntryAsPolyData(entry);
      });
    const coSurfacePromises = getDataGroupHeaderByName(tpHeader, "coaptation-surface")
      .data_group_entries.map((entry) => {
        return readEntryAsPolyData(entry);
      });
    const volumeMainPromise = getDataGroupHeaderByName(tpHeader, "volume-main")
      .data_group_entries.map((entry) => {
        return readEntryAsImageData(entry);
      });
    const volumeSegPromise = getDataGroupHeaderByName(tpHeader, "volume-segmentation")
      .data_group_entries.map((entry) => {
        return readEntryAsImageData(entry);
      });
  
    const [modelSL, modelML, coSurface, volumeMain, volumeSeg] = await Promise.all([
      Promise.all(modelSLPromises),
      Promise.all(modelMLPromises),
      Promise.all(coSurfacePromises),
      Promise.all(volumeMainPromise),
      Promise.all(volumeSegPromise),
    ]);
  
    console.log(`[DataLoaderWorker::loadTPData] tp[${tpHeader.tp}] completed`);
  
    return createTimePointData(tpHeader.tp, volumeMain, volumeSeg, modelSL, modelML, coSurface);
  }

  static getInstance(gwHelper, dsHelper) {
    if (!StudyDataLoader.instance) {
      StudyDataLoader.instance = new StudyDataLoader(gwHelper, dsHelper);
    }
    return StudyDataLoader.instance;
  }
}