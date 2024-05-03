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

    const loader = StudyDataLoader.getInstance(studyDataHeader, gwHelper, dsHelper);
    loader.LoadStudyData().then((data) => {
      console.log("[AVRPDataProvider] useEffect[], data: ", data);
      setTPData(data);
    });
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