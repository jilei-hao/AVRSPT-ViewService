import { TimePointData } from "../../models";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";

export default class StudyDataLoader {
  constructor(gwHelper, dsHelper) {
    this._gwHelper = gwHelper;
    this._dsHelper = dsHelper;
    this._isLoading = false;
  }

  static instance = null;

  async loadTPData(studyDataHeader, tpInd) {
    console.log("[StudyDataLoader::LoadTPData] tpInd: ", tpInd);
    const tpHeader = studyDataHeader.tpHeaders[tpInd];
    const tpData = new TimePointData(tpHeader.tp);
    const polyDataReader = vtkXMLPolyDataReader.newInstance();

    const slModelBinary = await this._dsHelper.getData(tpHeader.singleLabelModel.dsid);
    tpData.singleLabelModel = polyDataReader.parseAsArrayBuffer(slModelBinary);
  }
  


  static getInstance(gwHelper, dsHelper) {
    if (!StudyDataLoader.instance) {
      StudyDataLoader.instance = new StudyDataLoader(gwHelper, dsHelper);
    }
    return StudyDataLoader.instance;
  }
}