
/*
  * This context manages the state of the viewer
*/

import React, { createContext, useContext, useState, useEffect} from 'react';

const AVRPViewerStateContext = createContext();

export default function AVRPViewerStateProvider({ children }) {
  console.log("[AVRPViewerStateProvider]");
  const [activeTP, setActiveTP] = useState(0);
  const [numberOfTP, setNumberOfTP] = useState(1);
  const [tpDataLoaded, setTPDataLoaded] = useState([]);

  useEffect(() => {
    console.log("[AVRPViewerStateProvider] useEffect[], tpDataLoaded: ", tpDataLoaded);
  }, [tpDataLoaded]);


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