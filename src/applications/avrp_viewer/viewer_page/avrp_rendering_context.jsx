import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { AVRPView, AVRPViewModel } from './avrp_view';

const AVRPRenderingContext = createContext();

export default function AVRPRenderingProvider({ children }) {
  const [viewModels, setViewModels] = useState([]);
  const viewIdsRef = useRef([]);

  const removeView = (id) => {
    const vm = viewModels.find(v => v.id === id);
    if (vm) {
      viewIdsRef.current = viewIdsRef.current.filter(v => v !== id);
      vm.dispose();
      setViewModels(prevViewModels => prevViewModels.filter(v => v.id !== id));
    }
  };

  const removeAllViews = () => {
    viewIdsRef.current = [];
    setViewModels([]);
  };

  const addView = async (viewId, pctTop, pctLeft, pctWidth, pctHeight) => {
    console.log("[addView] viewId: ", viewId);
    if (viewIdsRef.current.includes(viewId)) {
      console.log("[addView] view already exists", viewId);
      return;
    } else {
      viewIdsRef.current.push(viewId);
    }

    const newViewModel = new AVRPViewModel(viewId, pctTop, pctLeft, pctWidth, pctHeight);
    setViewModels(prevViewModels => [...prevViewModels, newViewModel]);
  };

  const getView = (id) => {
    return viewModels.find(v => v.id === id);
  }

  return (
    <AVRPRenderingContext.Provider value={[
      addView,
      getView,
      removeAllViews,
      removeView,
    ]}>
      <div style={{position: 'absolute', width: '100vw', height: '90vh', top: '0', left: '0', backgroundColor: 'purple'}}>
        { viewModels.map((model) => {
          const g = model.getGeometry();
          return (
            <AVRPView key={model.getId()} viewId={model.getId()} 
              pctTop={g.pctTop} pctLeft={g.pctLeft} pctWidth={g.pctWidth} pctHeight={g.pctHeight} 
              setWindowContainer={model.setWindowContainer}
            />
          );
        })}
      </div>
      { children }
    </AVRPRenderingContext.Provider>
  );
}

export function useAVRPRendering() {
  return useContext(AVRPRenderingContext);
}