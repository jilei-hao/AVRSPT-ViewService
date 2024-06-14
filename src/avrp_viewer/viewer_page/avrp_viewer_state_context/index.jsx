
/*
  * This context manages the state of the viewer
*/

import React, { createContext, useContext, useState, useEffect} from 'react';
import { useAVRPGlobal } from '../../avrp_global_context';
import useViewerConfiguration from './viewer_configuration';

const AVRPViewerStateContext = createContext();

export default function AVRPViewerStateProvider({ children }) {
  const { studyDataHeader } = useAVRPGlobal();
  const [activeTP, setActiveTP] = useState(0);
  const [numberOfTP, setNumberOfTP] = useState(1);
  const [tpDataLoaded, setTPDataLoaded] = useState([]);
  const [viewHeaders, setViewHeaders] = useState([]);
  const { getViewHeaders, getDefaultLabelRGBA } = useViewerConfiguration();
  const [labelRGBA, setLabelRGBA] = useState(getDefaultLabelRGBA())

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
    setViewHeaders(getViewHeaders());
  }, []);


  return (
    <AVRPViewerStateContext.Provider value={{ 
      activeTP, setActiveTP, numberOfTP, setNumberOfTP, 
      tpDataLoaded, setTPDataLoaded, viewHeaders, setViewHeaders,
      labelRGBA, setLabelRGBA
      }}>
      { children }
    </AVRPViewerStateContext.Provider>
  );
}

export function useAVRPViewerState() {
  return useContext(AVRPViewerStateContext);
}