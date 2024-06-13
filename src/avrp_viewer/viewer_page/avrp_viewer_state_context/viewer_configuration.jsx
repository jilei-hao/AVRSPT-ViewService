
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

  return {
    getViewHeaders,
  }
}