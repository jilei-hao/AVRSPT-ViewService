
/*
  * This context provides controller logic, rendering and the state of the application
*/

import React, { createContext, useContext, useState, useEffect} from 'react';
import { useAVRPRendering } from './avrp_rendering_context';

const AVRPApplicationContext = createContext();

export default function AVRPApplicationProvider({ children }) {
  console.log("[AVRPApplicationProvider]");
  const [uiContollers, setUIControllers] = useState(new Map());
  const [AddView, GetView, RemoveAllViews, RemoveView] = useAVRPRendering();

  useEffect(() => {
    RemoveAllViews();
    const initStyle = { 
      position: 'absolute', 
      width: '50%', 
      height: '50%', 
      top: '0', 
      left: '0'
    };
    const id = AddView(initStyle);
    console.log("[AVRPApplicationProvider] id: ", id);
  }, []);

  return (
    <AVRPApplicationContext.Provider value={{
      uiContollers
    }}>
      { children }
    </AVRPApplicationContext.Provider>
  );
}

export function useAVRPApplication() {
  return useContext(AVRPApplicationContext);
}