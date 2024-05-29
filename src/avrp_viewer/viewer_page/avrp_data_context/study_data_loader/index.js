import { getDataGroupHeaderByName, createTimePointData } from "@viewer/models";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import { AVRPDataServerHelper, AVRPGatewayHelper } from "@viewer/api_helpers";

export default class StudyDataLoader {
  constructor() {
    this._gwHelper = AVRPGatewayHelper.getInstance();
    this._dsHelper = AVRPDataServerHelper.getInstance();
    this._isLoading = false;
  }

  static instance = null;

  readEntryAsPolyData = async (entry) => {
    const reader = vtkXMLPolyDataReader.newInstance();
    const binary = await AVRPDataServerHelper.getData(entry.data_server_id);
    reader.parseAsArrayBuffer(binary);
    return {
      primary_index: entry.primary_index_desc,
      secondary_index: entry.secondary_index_desc,
      data: reader.getOutputData(0),
    };
  };


  async loadTPData(tpHeader) {
    console.log("[StudyDataLoader::loadTPData] tpHeader: ", tpHeader);
  
    const volume = null;
    const modelSLPromises = getDataGroupHeaderByName(tpHeader, "model-sl")
      .data_group_entries.map((entry) => {
        return this.readEntryAsPolyData(entry);
      });
    const modelMLPromises = getDataGroupHeaderByName(tpHeader, "model-ml")
      .data_group_entries.map((entry) => {
        return this.readEntryAsPolyData(entry);
      });
    const coSurfacePromises = getDataGroupHeaderByName(tpHeader, "coaptation-surface")
      .data_group_entries.map((entry) => {
        return this.readEntryAsPolyData(entry);
      });
  
    const modelSL = await Promise.all(modelSLPromises);
    const modelML = await Promise.all(modelMLPromises);
    const coSurface = await Promise.all(coSurfacePromises);
  
    return createTimePointData(tpHeader.tp, volume, modelSL, modelML, coSurface);
  }
  


  static getInstance(gwHelper, dsHelper) {
    if (!StudyDataLoader.instance) {
      StudyDataLoader.instance = new StudyDataLoader(gwHelper, dsHelper);
    }
    return StudyDataLoader.instance;
  }
}