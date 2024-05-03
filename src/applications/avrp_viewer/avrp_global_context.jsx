import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './avrp_auth_context';
import { AVRPGatewayHelper } from './api_helpers';

const AVRPGlobalContext = createContext();

/*
  * This context provides global state for the application
  * It stores data related to the active user and study data headers
  * Actual study data should be loaded to avrp_data_context
*/

export default function AVRPGlobalProvider({ children  }) {
  const [studyBrowserActive, setStudyBrowserActive] = useState(true);
  const [studyId, setStudyId] = useState(null);
  const { user } = useAuth();
  const [caseStudyHeaders, setCaseStudyHeaders] = useState([]);
  const [studyDataHeader, setStudyDataHeader] = useState([]);

  useEffect(() => {
    console.log("[AVRPGlobalProvider] user: ", user);
    if (user) {
      const gwHelper = AVRPGatewayHelper.getInstance();
      gwHelper.getCaseStudyHeaders().then((data) => {
        setCaseStudyHeaders(data);
      });
    }
  }, [user]);

  useEffect(() => {
    console.log("[AVRPGlobalProvider] studyId: ", studyId);
    if (studyId) {
      const gwHelper = AVRPGatewayHelper.getInstance();
      gwHelper.getStudyDataHeader(studyId).then((data) => {
        setStudyDataHeader(data);
      });
    }
  }, [studyId]);

  return (
    <AVRPGlobalContext.Provider value={{
      studyBrowserActive, setStudyBrowserActive,
      studyId, setStudyId,
      studyDataHeader,
      caseStudyHeaders,
    }}>
      { children }
    </AVRPGlobalContext.Provider>
  );
}

export function useAVRPGlobal() {
  return useContext(AVRPGlobalContext);
}