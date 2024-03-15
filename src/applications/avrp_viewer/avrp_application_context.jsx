
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
    AddView(0, 0, 75, 100);
    AddView(0, 75, 25, 33);
    AddView(33, 75, 25, 33);
    AddView(66, 75, 25, 34);
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