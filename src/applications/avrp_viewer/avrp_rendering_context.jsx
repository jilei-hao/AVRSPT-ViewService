import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import AVRPRenderWindow from './avrp_render_window';

const AVRPRenderingContext = createContext();

export default function AVRPRenderingProvider({ children }) {
  const renderingContainerRef = useRef();
  const [renderContainers, setRenderContainers] = useState([]);
  const [renderWindows, setRenderWindows] = useState([]);
  const lastWindowId = useRef(0);

  const AddRenderWindow = () => {
    console.log("[AddRenderWindow] ");
    const newId = `renderContainer${lastWindowId.current++}`;
    const newRenderContainer = <div key={newId} ref={ref => {
      if (ref) {
        const style = {position: 'relative', width: '50%', height: '50%', top: '0', left: '0'};
        const newRenderWindow = new AVRPRenderWindow(newId, ref, style);
        setRenderWindows(prevRenderWindows => [...prevRenderWindows, newRenderWindow]);
      }
    }} />;
    setRenderContainers(prevRenderContainers => [...prevRenderContainers, newRenderContainer]);
    return newId;
  };

  const GetRenderWindow = (id) => {
    return renderWindows.find(rw => rw.GetId() === id);
  }

  return (
    <AVRPRenderingContext.Provider value={[
      AddRenderWindow,
      GetRenderWindow,
    ]}>
    <div style={{position: 'absolute', width: '100vw', height: '92vh', top: '0', left: '0', backgroundColor: 'purple'}}>
      { renderContainers }
    </div>
    { children }
    </AVRPRenderingContext.Provider>
  );
}

export function useAVRPRendering() {
  return useContext(AVRPRenderingContext);
}