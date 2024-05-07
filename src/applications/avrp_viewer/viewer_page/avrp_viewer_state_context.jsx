
/*
  * This context manages the state of the viewer
*/

import React, { createContext, useContext, useState, useEffect} from 'react';
import { useAVRPGlobal } from '../avrp_global_context';
import { studyData } from '../../../model/studies';

const AVRPViewerStateContext = createContext();

export default function AVRPViewerStateProvider({ children }) {
  console.log("[AVRPViewerStateProvider]");
  const [activeTP, setActiveTP] = useState(0);
  const [numberOfTP, setNumberOfTP] = useState(1);
  const [tpDataLoaded, setTPDataLoaded] = useState([]);
  const { studyDataHeader } = useAVRPGlobal();

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


  return (
    <AVRPViewerStateContext.Provider value={{ 
      activeTP, setActiveTP, numberOfTP, setNumberOfTP, 
      tpDataLoaded, setTPDataLoaded
      }}>
      { children }
    </AVRPViewerStateContext.Provider>
  );
}

export function useAVRPViewerState() {
  return useContext(AVRPViewerStateContext);
}