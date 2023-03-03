import config from "../../server-config.json"

export const BASE_DATA_URL = `http://${config.host}:${config.port}`;

const devDisplayConfig = {
  imageConfig: {

  },
  labelConfig: {
    min: 0,
    max: 4,
    labels: [
      {
        Number: 0,
        RGBA: [0, 0, 0, 0],
        Description: "Background"
      },
      {
        Number: 2,
        RGBA: [1, 1, 1, 1],
        Description: "Cusp"
      },
      {
        Number: 4,
        RGBA: [1, 0.87, 0.74, 1],
        Description: "Root"
      }
    ]
  }
}


export const cases = {
  "dev_cta-3tp": {
    nT: 3,
    volumes: [
      'dist/cta/volume/rs40/image_rs40_bavcta008_00.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_01.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_02.vti',
    ],
    models: [
      'dist/cta/model/dc50/mesh_dc50_bavcta008_01.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_02.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_03.vtp',
    ],
    segmentations: [
      'dist/cta/segmentation/seg_rs40_bavcta008_00.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_01.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_02.vti',
    ],
    displayConfig: devDisplayConfig,
  },
  "dev_cta-20tp": {
    nT: 20,
    volumes: [
      'dist/cta/volume/rs40/image_rs40_bavcta008_00.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_01.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_02.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_03.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_04.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_05.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_06.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_07.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_08.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_09.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_10.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_11.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_12.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_13.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_14.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_15.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_16.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_17.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_18.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_19.vti',
    ],
    models: [
      'dist/cta/model/dc50/mesh_dc50_bavcta008_01.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_02.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_03.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_04.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_05.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_06.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_07.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_08.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_09.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_10.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_11.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_12.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_13.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_14.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_15.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_16.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_17.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_18.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_19.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_20.vtp',
    ],
    segmentations: [
      'dist/cta/segmentation/seg_rs40_bavcta008_00.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_01.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_02.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_03.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_04.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_05.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_06.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_07.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_08.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_09.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_10.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_11.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_12.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_13.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_14.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_15.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_16.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_17.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_18.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_19.vti',
    ],
    displayConfig: devDisplayConfig,
  },
  "dev_cta-10tp": {
    nT: 10,
    volumes: [
      'dist/cta/volume/rs40/image_rs40_bavcta008_10.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_11.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_12.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_13.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_14.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_15.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_16.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_17.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_18.vti',
      'dist/cta/volume/rs40/image_rs40_bavcta008_19.vti',
    ],
    models: [
      'dist/cta/model/dc50/mesh_dc50_bavcta008_11.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_12.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_13.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_14.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_15.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_16.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_17.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_18.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_19.vtp',
      'dist/cta/model/dc50/mesh_dc50_bavcta008_20.vtp',
    ],
    segmentations: [
      'dist/cta/segmentation/seg_rs40_bavcta008_10.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_11.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_12.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_13.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_14.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_15.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_16.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_17.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_18.vti',
      'dist/cta/segmentation/seg_rs40_bavcta008_19.vti',
    ],
    displayConfig: devDisplayConfig,
  }
}
