import React, { createContext, useContext, useState, useEffect} from 'react';

const AVRPDataContext = createContext();

export default function AVRPDataProvider({ children, studyId }) {
  console.log("[AVRPDataProvider] studyId: ", studyId);


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