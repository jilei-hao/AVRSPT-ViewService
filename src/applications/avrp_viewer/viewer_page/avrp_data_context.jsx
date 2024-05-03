import React, { createContext, useContext, useState, useEffect, useRef} from 'react';
import { AVRPDataServerHelper, AVRPGatewayHelper } from '../api_helpers';
import { TimePointData } from '../models';
import { useAVRPGlobal } from '../avrp_global_context';
import StudyDataLoader from './study_data_loader';

const AVRPDataContext = createContext();

export default function AVRPDataProvider({ children }) {
  const [tpData, setTPData] = useState([]);
  const { studyDataHeader } = useAVRPGlobal();

  useEffect(() => {
    console.log("[AVRPDataProvider] useEffect[], studyDataHeader: ", studyDataHeader);
    const gwHelper = AVRPGatewayHelper.getInstance();
    const dsHelper = AVRPDataServerHelper.getInstance();

    const loader = StudyDataLoader.getInstance(gwHelper, dsHelper);

    for (let i = 0; i < studyDataHeader.tpHeaders.length; i++) {
      const tpHeader = studyDataHeader.tpHeaders[i];
      loader.loadTPData(tpHeader).then((tpData) => {
        setTPData((prev) => {
          const updatedTPData = [...prev];
          updatedTPData[i] = tpData;
          return updatedTPData;
        });
      });
    }
  }, []);

  return (
    <AVRPDataContext.Provider value={{tpData}}>
      { children }
    </AVRPDataContext.Provider>
  );
}

export function useAVRPData() {
  return useContext(AVRPDataContext);
}