
/*
  * This context manages the state of the viewer
*/

import React, { createContext, useContext, useState, useEffect} from 'react';
import { useAVRPGlobal } from '../../avrp_global_context';

const AVRPViewerStateContext = createContext();

export default function AVRPViewerStateProvider({ children }) {
  const { studyDataHeader } = useAVRPGlobal();
  const [activeTP, setActiveTP] = useState(0);
  const [numberOfTP, setNumberOfTP] = useState(1);
  const [tpDataLoaded, setTPDataLoaded] = useState([]);
  const [viewHeaders, setViewHeaders] = useState([]);

  useEffect(() => {
    console.log("[AVRPViewerStateProvider] useEffect[], tpDataLoaded: ", tpDataLoaded);
  }, [tpDataLoaded]);

  useEffect(() => {
    console.log("[AVRPViewerStateProvider] useEffect[], studyDataHeader: ", studyDataHeader);
    if (studyDataHeader.tpHeaders) {
      setNumberOfTP(studyDataHeader.tpHeaders.length);
      setTPDataLoaded(new Array(studyDataHeader.tpHeaders.length).fill(false));
    }
  }, [studyDataHeader]);

  useEffect(() => {
    setViewHeaders([{
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
    );
  }, [])


  return (
    <AVRPViewerStateContext.Provider value={{ 
      activeTP, setActiveTP, numberOfTP, setNumberOfTP, 
      tpDataLoaded, setTPDataLoaded, viewHeaders, setViewHeaders
      }}>
      { children }
    </AVRPViewerStateContext.Provider>
  );
}

export function useAVRPViewerState() {
  return useContext(AVRPViewerStateContext);
}