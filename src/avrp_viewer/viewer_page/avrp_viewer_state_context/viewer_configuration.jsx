
export default function useViewerConfiguration() {
  const getViewHeaders = () => [{
      id: 1, 
      type: '3d',
      slicingMode: 'none',
      geometry: {
        pctTop: 0,
        pctLeft: 0,
        pctWidth: 75,
        pctHeight: 100
      },
      layers: [{
          id: 1,
          type: 'model-sl',
          subtype: 'none',
          name: 'Simple Model',
        }, {
          id: 2,
          type: 'coaptation-surface',
          subtype: 'none',
          name: 'Coaptation Surface',
        }, {
          id: 3,
          type: 'model-ml',
          subtype: 'none',
          name: 'Multi Label Model',
        }
      ],
      modes: [{
          id: 1,
          name: 'Simple Model',
          layers: [1]
        }, {
          id: 2,
          name: 'Coaptation Surface',
          layers: [1, 2]
        }, {
          id: 3,
          name: 'Anatomy',
          layers: [3]
        }
      ]
    }, {
      id: 2,
      type: 'slicing-x',
      slicingMode: 'X',
      geometry: {
        pctTop: 0,
        pctLeft: 75,
        pctWidth: 25,
        pctHeight: 33
      },
      layers: [{
        id: 1,
        type: 'volume-main-slicing',
        subtype: 'X',
        name: 'Main Slicing X',
      }, {
        id: 2,
        type: 'volume-seg-slicing',
        subtype: 'X',
        name: 'Seg Slicing X',
      }],
      modes: [{
        id: 1,
        name: 'Slicing-X',
        layers: [1, 2]
      }]
    }, {
      id: 3,
      type: 'slicing-y',
      slicingMode: 'Y',
      geometry: {
        pctTop: 33,
        pctLeft: 75,
        pctWidth: 25,
        pctHeight: 33
      },
      layers: [{
        id: 1,
        type: 'volume-main-slicing',
        subtype: 'Y',
        name: 'Main Slicing Y',
      }, {
        id: 2,
        type: 'volume-seg-slicing',
        subtype: 'Y',
        name: 'Seg Slicing Y',
      }],
      modes: [{
        id: 1,
        name: 'Slicing-Y',
        layers: [1, 2]
      }]
    }, {
      id: 4,
      type: 'slicing-z',
      slicingMode: 'Z',
      geometry: {
        pctTop: 66,
        pctLeft: 75,
        pctWidth: 25,
        pctHeight: 34
      },
      layers: [{
        id: 1,
        type: 'volume-main-slicing',
        subtype: 'Z',
        name: 'Main Slicing Z',
      }, {
        id: 2,
        type: 'volume-seg-slicing',
        subtype: 'Z',
        name: 'Seg Slicing Z',
      }],
      modes: [{
        id: 1,
        name: 'Slicing-Z',
        layers: [1, 2]
      }]
  }]

  const defaultLabelOpacity = 128;
  const defaultTissueRGBA = [255, 233, 205, defaultLabelOpacity];

  const getDefaultLabelRGBA = () => {
    return {
      0: [0, 0, 0, 0],
      1: defaultTissueRGBA,
      2: defaultTissueRGBA,
      3: defaultTissueRGBA,
      4: defaultTissueRGBA,
      5: defaultTissueRGBA,
      6: defaultTissueRGBA,
      7: defaultTissueRGBA,
      8: defaultTissueRGBA,
      9: defaultTissueRGBA,
      10: defaultTissueRGBA,
      11: defaultTissueRGBA,
      12: defaultTissueRGBA,
      13: defaultTissueRGBA,
      14: defaultTissueRGBA,
      15: defaultTissueRGBA,
      16: defaultTissueRGBA,
    }
  };

  const getITKSNAPDefaultLabelRGBA = () => {
    return {
      0: [0, 0, 0, 0],
      1: [255, 0, 0, 255],
      2: [0, 255, 0, 255],
      3: [0, 0, 255, 255],
      4: [255, 255, 0, 255],
      5: [255, 0, 255, 255],
      6: [0, 255, 255, 255],
      7: [255, 255, 255, 255],
      8: [128, 0, 0, 255],
      9: [0, 128, 0, 255],
      10: [0, 0, 128, 255],
      11: [128, 128, 0, 255],
      12: [128, 0, 128, 255],
      13: [0, 128, 128, 255],
      14: [128, 128, 128, 255],
      15: [192, 192, 192, 255],
      16: [255, 128, 128, 255],
    }
  };

  return {
    getViewHeaders,
    defaultLabelOpacity,
    defaultTissueRGBA,
    getDefaultLabelRGBA,
    getITKSNAPDefaultLabelRGBA,
  }
}