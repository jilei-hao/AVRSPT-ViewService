
export default function useViewerConfiguration() {
  const getViewHeaders = () => [{
      id: 1, 
      type: '3d',
      geometry: {
        pctTop: 0,
        pctLeft: 0,
        pctWidth: 75,
        pctHeight: 100
      },
      layers: [{
          id: 1,
          type: 'model-sl',
          name: 'Simple Model',
        }, {
          id: 2,
          type: 'coaptation-surface',
          name: 'Coaptation Surface',
        }
      ]
    }, {
      id: 2,
      type: 'slicing-axial',
      geometry: {
        pctTop: 0,
        pctLeft: 75,
        pctWidth: 25,
        pctHeight: 33
      },
      layers: []
    }, {
      id: 3,
      type: 'slicing-sagittal',
      geometry: {
        pctTop: 33,
        pctLeft: 75,
        pctWidth: 25,
        pctHeight: 33
      },
      layers: []
    }, {
      id: 4,
      type: 'slicing-coronal',
      geometry: {
        pctTop: 66,
        pctLeft: 75,
        pctWidth: 25,
        pctHeight: 34
      },
      layers: []
  }]

  return {
    getViewHeaders,
  }
}