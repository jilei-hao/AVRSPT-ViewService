import React, { createContext, useContext, useState, useEffect, useRef} from 'react';
import { AVRPStudyData } from './avrp_study_data';
import { AVRPDataServerHelper, AVRPGatewayHelper } from './api_helpers';

const AVRPDataContext = createContext();

export default function AVRPDataProvider({ children, studyId }) {
  console.log("[AVRPDataProvider] studyId: ", studyId);
  
  const studyDataRef = useRef(null);

  useEffect(() => {
    if (!studyDataRef.current) {
      const gwHelper = AVRPGatewayHelper.getInstance();
      const dsHelper = AVRPDataServerHelper.getInstance();
      studyDataRef.current = AVRPStudyData.getInstance(studyId, gwHelper, dsHelper);
    }
  }, []);




  return (
    <AVRPDataContext.Provider value={{
      studyId
    }}>
      { children }
    </AVRPDataContext.Provider>
  );
}

export function useAVRPData() {
  return useContext(AVRPDataContext);
}