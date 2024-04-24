import React, { createContext, useState, useContext } from 'react';

const AVRPGlobalContext = createContext();

export default function AVRPGlobalProvider({ children  }) {
  const [studyBrowserActive, setStudyBrowserActive] = useState(true);
  const [studyId, setStudyId] = useState(null);
  const [caseStudyHeaders, setCaseStudyHeaders] = useState([
    {
      id: 1,
      case_name: 'dev-case-1',
      studies: [
        {
          id: 1,
          study_name: 'dev-study-1',
        },
        {
          id: 2,
          study_name: 'dev-study-2',
        },
      ]
    },
    {
      id: 2,
      case_name: 'dev-case-2',
      studies: [
        {
          id: 3,
          study_name: 'dev-study-3',
        },
        {
          id: 4,
          study_name: 'dev-study-4',
        },
      ]
    },
    {
      id: 3,
      case_name: 'dev-case-3',
      studies: [
        {
          id: 5,
          study_name: 'dev-study-5',
        },
        {
          id: 6,
          study_name: 'dev-study-6',
        },
      ],
    }
  ]);

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