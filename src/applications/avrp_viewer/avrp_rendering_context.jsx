import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import AVRPView from './avrp_view';

const AVRPRenderingContext = createContext();

export default function AVRPRenderingProvider({ children }) {
  const renderingContainerRef = useRef();
  const [renderContainers, setRenderContainers] = useState([]);
  const views = useRef([]);
  const lastWindowId = useRef(0);

  const RemoveView = (id) => {
    views.current.find(v => v.GetId() === id).Dispose();
    views.current = views.current.filter(v => v.GetId() !== id);
    setRenderContainers(prevRenderContainers => prevRenderContainers.filter(rc => rc.key !== id));
  };

  const RemoveAllViews = () => {
    views.current.forEach(v => v.Dispose());
    setRenderContainers([]);
    lastWindowId.current = 0;
  };

  const AddView = (initStyle) => {
    console.log("[AddView] ");
    const newId = lastWindowId.current++;
    const newContainerId = `viewContainer_${newId}`;
    const newRenderContainer = <div key={newContainerId} ref={ref => {
      if (ref) {
        console.log("[AddView::ref callback] ref: ", ref);
        const newView = new AVRPView(newId, ref, initStyle);
        views.current.push(newView);
      }
    }} />;
    setRenderContainers(prevRenderContainers => [...prevRenderContainers, newRenderContainer]);
    return newId;
  };
  const GetView = (id) => {
    return views.current.find(v => v.GetId() == id);
  }

  return (
    <AVRPRenderingContext.Provider value={[
      AddView,
      GetView,
      RemoveAllViews,
      RemoveView,
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