export default class StudyDataLoader {
  constructor(studyDataHeader, gwHelper, dsHelper) {
    this._studyDataHeader = studyDataHeader;
    this._gwHelper = gwHelper;
    this._dsHelper = dsHelper;
    this._isLoading = false;
  }

  static instance = null;

  LoadStudyData() {
    console.log("[StudyDataLoader::LoadStudyData] isLoading: ", this._isLoading);
    if (this._isLoading)
      return;
    
    // sleep for 5 seconds
    return new Promise(r => setTimeout(r, 5000)).then(() => {
      return [{tp: 1}, {tp: 2}];
    });
  }

  static getInstance(studyDataHeader, gwHelper, dsHelper) {
    if (!StudyDataLoader.instance) {
      StudyDataLoader.instance = new StudyDataLoader(studyDataHeader, gwHelper, dsHelper);
    }
    return StudyDataLoader.instance;
  }
}