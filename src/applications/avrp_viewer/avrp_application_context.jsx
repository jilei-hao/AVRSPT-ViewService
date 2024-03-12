
/*
  * This context provides controller logic, rendering and the state of the application
*/

import React, { createContext, useContext, useState, useEffect} from 'react';
import { useAVRPRendering } from './avrp_rendering_context';

const AVRPApplicationContext = createContext();

export default function AVRPApplicationProvider({ children }) {
  console.log("[AVRPApplicationProvider]");
  const [uiContollers, setUIControllers] = useState(new Map());
  const [AddRenderWindow, GetRenderWindow] = useAVRPRendering();

  useEffect(() => {
    if (GetRenderWindow("renderContainer0") !== undefined)
      return;

    const id = AddRenderWindow();
  }, [AddRenderWindow, GetRenderWindow]);

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