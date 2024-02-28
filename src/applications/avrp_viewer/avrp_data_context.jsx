import React, { createContext, useContext, useState, useEffect} from 'react';
import AVRPDataManager from './avrp_data_manager';

const AVRPDataContext = createContext();

export default function AVRPDataProvider({ children, studyId }) {
  console.log("[AVRPDataProvider] studyId: ", studyId);
  const [avrpDataManager, ] = useState(new AVRPDataManager(studyId));

  const getLoadingProgress = () => {
    return avrpDataManager.getLoadingProgress();
  }

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