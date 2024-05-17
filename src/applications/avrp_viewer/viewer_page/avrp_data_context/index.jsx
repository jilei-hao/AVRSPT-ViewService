import React, { createContext, useContext, useState, useEffect, useRef} from 'react';
import { useAVRPGlobal } from '../../avrp_global_context';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import StudyDataLoader from './study_data_loader';

const AVRPDataContext = createContext();

export default function AVRPDataProvider({ children }) {
  const [tpData, setTPData] = useState([]);
  const { tpDataLoaded, setTPDataLoaded, activeTP } = useAVRPViewerState([]);
  const { studyDataHeader } = useAVRPGlobal();

  useEffect(() => {
    console.log("[AVRPDataProvider] useEffect[], studyDataHeader: ", studyDataHeader);
    if (studyDataHeader.tpHeaders.length > 0) {
      const loader = StudyDataLoader.getInstance();

      // sort tpHeaders by tp
      studyDataHeader.tpHeaders.sort((a, b) => a.tp - b.tp);

      for (let i = 0; i < studyDataHeader.tpHeaders.length; i++) {
        const tpHeader = studyDataHeader.tpHeaders[i];
        loader.loadTPData(tpHeader).then((tpData) => {
          setTPData((prev) => {
            const updatedTPData = [...prev];
            updatedTPData[i] = tpData;
            return updatedTPData;
          });
          setTPDataLoaded((prev) => {
            const updatedTPDataLoaded = [...prev];
            updatedTPDataLoaded[i] = true;
            return updatedTPDataLoaded;
          });
        });
      }
    }
  }, [studyDataHeader]);

  const getActiveTPData = (type) => {
    if (tpData.length === 0) {
      return null;
    }

    const activeTPData = tpData[activeTP];

    if (!activeTPData)
      return null;

    switch(type) {
      case 'single-label-model':
        return activeTPData.singleLabelModel;
      case 'coaptation-surface':
        return activeTPData.coaptationSurface;
      default:
        return null;
    }
  }

  return (
    <AVRPDataContext.Provider value={{ tpData, getActiveTPData }}>
      { children }
    </AVRPDataContext.Provider>
  );
}

export function useAVRPData() {
  return useContext(AVRPDataContext);
}