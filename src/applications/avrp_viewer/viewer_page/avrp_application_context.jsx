
/*
  * This context provides controller logic
*/

import React, { createContext, useContext, useState, useEffect} from 'react';
import { useAVRPRendering } from './avrp_rendering_context';

const AVRPApplicationContext = createContext();

export default function AVRPApplicationProvider({ children }) {
  console.log("[AVRPApplicationProvider]");
  const [uiContollers, setUIControllers] = useState(new Map());
  const [addView, getView, removeAllViews, removeView] = useAVRPRendering();

  useEffect(() => {
    addView(1, 0, 0, 75, 100);
    addView(2, 0, 75, 25, 33);
    addView(3, 33, 75, 25, 33);
    addView(4, 66, 75, 25, 34);
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