import { TimePointData } from "@viewer/models";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import { AVRPDataServerHelper, AVRPGatewayHelper } from "@viewer/api_helpers";

export default class StudyDataLoader {
  constructor() {
    this._gwHelper = AVRPGatewayHelper.getInstance();
    this._dsHelper = AVRPDataServerHelper.getInstance();
    this._isLoading = false;
  }

  static instance = null;

  async loadTPData(tpHeader) {
    console.log("[StudyDataLoader::loadTPData] tpHeader: ", tpHeader);
    const tpData = new TimePointData(tpHeader.tp);
    const polyDataReader = vtkXMLPolyDataReader.newInstance();

    // load single label model
    const slModelBinary = await AVRPDataServerHelper.getData(
      tpHeader.getDataGroupHeaderByName('model-sl').dsid);

    polyDataReader.parseAsArrayBuffer(slModelBinary);
    tpData.singleLabelModel = polyDataReader.getOutputData(0);

    return tpData;
  }
  


  static getInstance(gwHelper, dsHelper) {
    if (!StudyDataLoader.instance) {
      StudyDataLoader.instance = new StudyDataLoader(gwHelper, dsHelper);
    }
    return StudyDataLoader.instance;
  }
}