const SolidRGBA = [240, 240, 240, 1];
const TissueRGBA = [255, 233, 205, 1];
const BackgroundRGBA = [0, 0, 0, 0];

const dispConfigCTA = {
  ImageConfig: {
    ColorLevel: 130,
    ColorWindow: 662,
  },
  LabelConfig: {
    Min: 0,
    Max: 16,
    LabelDescription: {
      0: "Background",
      1: "LCusp",
      2: "NCusp",
      3: "RCusp",
      4: "Whole Root Wall",
      5: "LVO",
      6: "STJ",
      7: "IAS",
      8: "LCRoot",
      9: "NCRoot",
      10: "RCRoot",
      11: "Raphe",
      12: "Lumen",
      13: "LCSinus",
      14: "NCSinus",
      15: "RCSinus",
      16: "Calcification"
    },
    DefaultColorPresetName: "Tissue Color",
    ColorPresets: {
      "Tissue Color": {
        0:  BackgroundRGBA,
        1:  TissueRGBA,
        2:  TissueRGBA,
        3:  TissueRGBA,
        4:  TissueRGBA,
        5:  TissueRGBA,
        6:  TissueRGBA,
        7:  TissueRGBA,
        8:  TissueRGBA,
        9:  TissueRGBA,
        10: TissueRGBA,
        11: TissueRGBA,
        12: TissueRGBA,
        13: TissueRGBA,
        14: TissueRGBA,
        15: TissueRGBA,
        16: TissueRGBA,
      },
      "Label": {
        0:  [0, 0, 0, 0],
        1:  [255, 0, 0, 1],
        2:  [82, 226, 140, 1],
        3:  [0, 0, 255, 1],
        4:  [255, 255, 0, 1],
        5:  [253, 128, 8, 1],
        6:  [204, 102, 255, 1],
        7:  [16, 128, 1, 1],
        8:  [255, 151, 102, 1],
        9:  [33, 255, 6, 1],
        10: [0, 255, 243, 1],
        11: [15, 128, 255, 1],
        12: [255, 255, 10, 1],
        13: [128, 64, 2, 1],
        14: [26, 198, 4, 1],
        15: [7, 64, 128, 1],
        16: [255, 255, 255, 1],
      },
      "Solid Color": {
        0:  [0, 0, 0, 0],
        1:  SolidRGBA,
        2:  SolidRGBA,
        3:  SolidRGBA,
        4:  SolidRGBA,
        5:  SolidRGBA,
        6:  SolidRGBA,
        7:  SolidRGBA,
        8:  SolidRGBA,
        9:  SolidRGBA,
        10: SolidRGBA,
        11: SolidRGBA,
        12: SolidRGBA,
        13: SolidRGBA,
        14: SolidRGBA,
        15: SolidRGBA,
        16: SolidRGBA,
      },
      "Cusps Highlighted": {
        0:  [0, 0, 0, 0],
        1:  [255,233,205, 1],
        2:  [255,233,205, 1],
        3:  [255,233,205, 1],
        4:  [99, 75, 255, 1],
        5:  [99, 75, 255, 1],
        6:  [99, 75, 255, 1],
        7:  [99, 75, 255, 1],
        8:  [99, 75, 255, 1],
        9:  [99, 75, 255, 1],
        10: [99, 75, 255, 1],
        11: [99, 75, 255, 1],
        12: [99, 75, 255, 1],
        13: [99, 75, 255, 1],
        14: [99, 75, 255, 1],
        15: [99, 75, 255, 1],
        16: [255, 255, 255, 1],
      },
      "Cusps Distinguished": {
        0:  [0, 0, 0, 0],
        1:  [255, 0, 0, 1],
        2:  [82, 226, 140, 1],
        3:  [0, 0, 255, 1],
        4:  [255, 233, 205, 1],
        5:  [255, 233, 205, 1],
        6:  [255, 233, 205, 1],
        7:  [255, 233, 205, 1],
        8:  [255, 233, 205, 1],
        9:  [255, 233, 205, 1],
        10: [255, 233, 205, 1],
        11: [255, 233, 205, 1],
        12: [255, 233, 205, 1],
        13: [255, 233, 205, 1],
        14: [255, 233, 205, 1],
        15: [255, 233, 205, 1],
        16: [255, 255, 255, 1],
      }
    }
  }
}


const dispConfigEcho = {
  ImageConfig: {
    ColorLevel: 100,
    ColorWindow: 130,
  },
  LabelConfig: {
    Min: 0,
    Max: 16,
    LabelDescription: {
      0: "Background",
      1: "LCusp",
      2: "NCusp",
      3: "RCusp",
      4: "Whole Root Wall",
      5: "LVO",
      6: "STJ",
      7: "IAS",
      8: "LCRoot",
      9: "NCRoot",
      10: "RCRoot",
      11: "Raphe",
      12: "Lumen",
      13: "LCSinus",
      14: "NCSinus",
      15: "RCSinus",
      16: "Calcification"
    },
    DefaultColorPresetName: "Tissue Color",
    ColorPresets: {
      "Tissue Color": {
        0:  BackgroundRGBA,
        1:  TissueRGBA,
        2:  TissueRGBA,
        3:  TissueRGBA,
        4:  TissueRGBA,
        5:  TissueRGBA,
        6:  TissueRGBA,
        7:  TissueRGBA,
        8:  TissueRGBA,
        9:  TissueRGBA,
        10: TissueRGBA,
        11: TissueRGBA,
        12: TissueRGBA,
        13: TissueRGBA,
        14: TissueRGBA,
        15: TissueRGBA,
        16: TissueRGBA,
      },
      "Label": {
        0:  [0, 0, 0, 0],
        1:  [255, 0, 0, 1],
        2:  [82, 226, 140, 1],
        3:  [0, 0, 255, 1],
        4:  [255, 255, 0, 1],
        5:  [253, 128, 8, 1],
        6:  [204, 102, 255, 1],
        7:  [16, 128, 1, 1],
        8:  [255, 151, 102, 1],
        9:  [33, 255, 6, 1],
        10: [0, 255, 243, 1],
        11: [15, 128, 255, 1],
        12: [255, 255, 10, 1],
        13: [128, 64, 2, 1],
        14: [26, 198, 4, 1],
        15: [7, 64, 128, 1],
        16: [255, 255, 255, 1],
      },
      "Solid Color": {
        0:  [0, 0, 0, 0],
        1:  SolidRGBA,
        2:  SolidRGBA,
        3:  SolidRGBA,
        4:  SolidRGBA,
        5:  SolidRGBA,
        6:  SolidRGBA,
        7:  SolidRGBA,
        8:  SolidRGBA,
        9:  SolidRGBA,
        10: SolidRGBA,
        11: SolidRGBA,
        12: SolidRGBA,
        13: SolidRGBA,
        14: SolidRGBA,
        15: SolidRGBA,
        16: SolidRGBA,
      },
      "Cusps Highlighted": {
        0:  [0, 0, 0, 0],
        1:  [255,233,205, 1],
        2:  [255,233,205, 1],
        3:  [255,233,205, 1],
        4:  [99, 75, 255, 1],
        5:  [99, 75, 255, 1],
        6:  [99, 75, 255, 1],
        7:  [99, 75, 255, 1],
        8:  [99, 75, 255, 1],
        9:  [99, 75, 255, 1],
        10: [99, 75, 255, 1],
        11: [99, 75, 255, 1],
        12: [99, 75, 255, 1],
        13: [99, 75, 255, 1],
        14: [99, 75, 255, 1],
        15: [99, 75, 255, 1],
        16: [255, 255, 255, 1],
      },
      "Cusps Distinguished": {
        0:  [0, 0, 0, 0],
        1:  [255, 0, 0, 1],
        2:  [82, 226, 140, 1],
        3:  [0, 0, 255, 1],
        4:  [255, 233, 205, 1],
        5:  [255, 233, 205, 1],
        6:  [255, 233, 205, 1],
        7:  [255, 233, 205, 1],
        8:  [255, 233, 205, 1],
        9:  [255, 233, 205, 1],
        10: [255, 233, 205, 1],
        11: [255, 233, 205, 1],
        12: [255, 233, 205, 1],
        13: [255, 233, 205, 1],
        14: [255, 233, 205, 1],
        15: [255, 233, 205, 1],
        16: [255, 255, 255, 1],
      }
    }
  }
}

export const studyHeaders = [
  {
    "key": "echo-14tp",
    "modality": "Echo",
    "sub_type": "",
  },
  {
    "key": "cta-20tp",
    "modality": "CT",
    "sub_type": "4DCTA",
  },
  {
    "key": "echo-3tp",
    "modality": "Echo",
    "sub_type": "",
  },
  {
    "key": "cta-3tp",
    "modality": "CT",
    "sub_type": "4DCTA",
  },
  {
    "key": "cta-18tp",
    "modality": "CT",
    "sub_type": "4DCTA",
  },
]

export const studyData = {
  "cta-18tp": {
    nT: 18,
    vol:[
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_02.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_03.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_04.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_05.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_06.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_07.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_08.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_09.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_10.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_11.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_12.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_13.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_14.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_15.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_16.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_17.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_18.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_19.vti',
    ],
    mdl:[
      'dist/bavcta008-tav48/cta/mdl/onemesh_03.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_04.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_05.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_06.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_07.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_08.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_09.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_10.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_11.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_12.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_13.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_14.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_15.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_16.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_17.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_18.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_19.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_20.vtp',
    ],
    seg: [
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_02.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_03.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_04.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_05.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_06.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_07.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_08.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_09.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_10.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_11.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_12.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_13.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_14.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_15.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_16.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_17.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_18.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_19.vti',
    ],
    DisplayConfig: dispConfigCTA,
  },
  "cta-3tp": {
    nT: 3,
    vol:[
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_00.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_01.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_02.vti',
    ],
    mdl:[
      'dist/bavcta008-tav48/cta/mdl/onemesh_01.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_02.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_03.vtp',
    ],
    seg: [
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_00.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_01.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_02.vti',
    ],
    DisplayConfig: dispConfigCTA,
  },
  "cta-20tp": {
    nT: 20,
    vol:[
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_00.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_01.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_02.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_03.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_04.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_05.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_06.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_07.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_08.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_09.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_10.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_11.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_12.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_13.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_14.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_15.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_16.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_17.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_18.vti',
      'dist/bavcta008-tav48/cta/vol/rs40/image_rs40_bavcta008_19.vti',
    ],
    mdl:[
      'dist/bavcta008-tav48/cta/mdl/onemesh_01.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_02.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_03.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_04.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_05.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_06.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_07.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_08.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_09.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_10.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_11.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_12.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_13.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_14.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_15.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_16.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_17.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_18.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_19.vtp',
      'dist/bavcta008-tav48/cta/mdl/onemesh_20.vtp',
    ],
    seg: [
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_00.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_01.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_02.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_03.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_04.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_05.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_06.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_07.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_08.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_09.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_10.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_11.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_12.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_13.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_14.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_15.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_16.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_17.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_18.vti',
      'dist/bavcta008-tav48/cta/seg/seg_rs40_bavcta008_19.vti',
    ],
    DisplayConfig: dispConfigCTA,
  },
  "echo-14tp": {
    nT: 14,
    vol:[
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_01.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_02.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_03.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_04.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_05.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_06.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_07.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_08.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_09.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_10.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_11.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_12.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_13.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs70_14.vti',
    ],
    mdl:[
      'dist/bavcta008-tav48/echo/mdl/onemesh_01.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_02.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_03.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_04.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_05.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_06.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_07.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_08.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_09.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_10.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_11.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_12.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_13.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_14.vtp',
    ],
    seg: [
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_01.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_02.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_03.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_04.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_05.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_06.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_07.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_08.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_09.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_10.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_11.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_12.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_13.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs70_14.vti',
    ],
    DisplayConfig: dispConfigEcho,
  },
  "echo-3tp": {
    nT: 3,
    vol:[
      'dist/bavcta008-tav48/echo/vol/img3d_rs100_01.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs100_02.vti',
      'dist/bavcta008-tav48/echo/vol/img3d_rs100_03.vti',
    ],
    mdl:[
      'dist/bavcta008-tav48/echo/mdl/onemesh_01.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_02.vtp',
      'dist/bavcta008-tav48/echo/mdl/onemesh_03.vtp',
    ],
    seg: [
      'dist/bavcta008-tav48/echo/seg/seg3d_rs100_01.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs100_02.vti',
      'dist/bavcta008-tav48/echo/seg/seg3d_rs100_03.vti',
    ],
    DisplayConfig: dispConfigEcho,
  }
}
