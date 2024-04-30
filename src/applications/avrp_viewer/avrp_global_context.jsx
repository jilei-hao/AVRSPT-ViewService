import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './avrp_auth_context';
import { AVRPGatewayHelper } from './api_helpers';

const AVRPGlobalContext = createContext();

export default function AVRPGlobalProvider({ children  }) {
  const [studyBrowserActive, setStudyBrowserActive] = useState(true);
  const [studyId, setStudyId] = useState(null);
  const { user } = useAuth();
  const [caseStudyHeaders, setCaseStudyHeaders] = useState([]);

  useEffect(() => {
    console.log("[AVRPGlobalProvider] user: ", user);
    if (user) {
      const gwHelper = AVRPGatewayHelper.getInstance();
      gwHelper.getCaseStudyHeaders().then((data) => {
        setCaseStudyHeaders(data);
      });
    }
  }, [user]);

  return (
    <AVRPGlobalContext.Provider value={{
      studyBrowserActive, setStudyBrowserActive,
      studyId, setStudyId,
      caseStudyHeaders,
    }}>
      { children }
    </AVRPGlobalContext.Provider>
  );
}

export function useAVRPGlobal() {
  return useContext(AVRPGlobalContext);
}