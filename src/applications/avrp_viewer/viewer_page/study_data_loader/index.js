import { TimePointData } from "../../models";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import { AVRPDataServerHelper, AVRPGatewayHelper } from "../../api_helpers";

export default class StudyDataLoader {
  constructor() {
    this._gwHelper = AVRPGatewayHelper.getInstance();
    this._dsHelper = AVRPDataServerHelper.getInstance();
    this._isLoading = false;
  }

  static instance = null;

  async loadTPData(tpHeader) {
    console.log("[StudyDataLoader::loadTPData] tpHeader: ", tpHeader);
    console.log("-- dsHelper: ", this._dsHelper);
    const tpData = new TimePointData(tpHeader.tp);
    const polyDataReader = vtkXMLPolyDataReader.newInstance();

    const slModelBinary = await AVRPDataServerHelper.getData(
      tpHeader.getDataGroupHeaderByName('model-sl').dsid);
    tpData.singleLabelModel = polyDataReader.parseAsArrayBuffer(slModelBinary);
  }
  


  static getInstance(gwHelper, dsHelper) {
    if (!StudyDataLoader.instance) {
      StudyDataLoader.instance = new StudyDataLoader(gwHelper, dsHelper);
    }
    return StudyDataLoader.instance;
  }
}