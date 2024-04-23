const AVRPTimepointDataType = {
  VOLUME: 'volume',
  COAPTATION_SURFACE: 'coaptation_surface',
  MULTI_LABEL_MODEL: 'multi_label_model',
  SINGLE_LABEL_MODEL: 'single_label_model',
}

class AVRPTimepointData {
  constructor(tpDataHeader, dsHelper) {
    console.log(`[AVRPTimepointData] constructor`);

    this.data = new Map(); // data type to data object map
    this.data_status = new Map(); // data type to boolean map
    this.tpDataHeader = tpDataHeader;
    this.dsHelper = dsHelper;

    // for each data type, fetch the data
    for (const type in AVRPTimepointDataType) {
      this.fetchData(type);
    }
  }

  setData(type, data) {
    this.data.set(type, data);
  }

  getData(type) {
    return this.data.get(type);
  }

  fetchData(type) {
    switch (type) {
      case AVRPTimepointDataType.VOLUME:
        this.fetchVolumeData();
        break;
      case AVRPTimepointDataType.COAPTATION_SURFACE:
        this.fetchCoaptationSurfaceData();
        break;
      case AVRPTimepointDataType.MULTI_LABEL_MODEL:
        this.fetchMultiLabelModelData();
        break;
      case AVRPTimepointDataType.SINGLE_LABEL_MODEL:
        this.fetchSingleLabelModelData();
        break;
      default:
        console.error(`[AVRPTimepointData] fetchData: unknown type ${type}`);
    }
  }

  fetchVolumeData() {
    console.log(`[AVRPTimepointData] fetchVolumeData`);
    // const volumeHeader = this.tpDataHeader[AVRPTimepointDataType['VOLUME']]
    // this.dsHelper.getData(volumeHeader.dsId).then((data) => {
    //   // parse as volume

    //   // set data
    // });
  }

  fetchSingleLabelModelData() {
    console.log(`[AVRPTimepointData] fetchSingleLabelModelData`);
    // const singleLabelModelHeader = this.tpDataHeader[AVRPTimepointDataType['SINGLE_LABEL_MODEL']]
    // this.dsHelper.getData(singleLabelModelHeader.dsId).then((data) => {
    //   // parse as single label model

    //   // set data
    // });
  }

  fetchMultiLabelModelData() {
    console.log(`[AVRPTimepointData] fetchMultiLabelModelData`);
    // const multiLabelModelHeader = this.tpDataHeader[AVRPTimepointDataType['MULTI_LABEL_MODEL']]
    // this.dsHelper.getData(multiLabelModelHeader.dsId).then((data) => {
    //   // parse as multi label model

    //   // set data
    // });
  }

  fetchCoaptationSurfaceData() {
    console.log(`[AVRPTimepointData] fetchCoaptationSurfaceData`);
    // const coaptationSurfaceHeader = this.tpDataHeader[AVRPTimepointDataType['COAPTATION_SURFACE']]
    // this.dsHelper.getData(coaptationSurfaceHeader.dsId).then((data) => {
    //   // parse as coaptation surface

    //   // set data
    // });
  }
}

export {
  AVRPTimepointDataType,
  AVRPTimepointData,
}