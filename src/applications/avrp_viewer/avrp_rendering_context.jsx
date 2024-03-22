import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { AVRPView, AVRPViewModel } from './avrp_view';

const AVRPRenderingContext = createContext();

export default function AVRPRenderingProvider({ children }) {
  const renderingContainerRef = useRef();
  const [renderContainers, setRenderContainers] = useState([]);
  const [viewModels, setViewModels] = useState([]);
  const lastViewId = useRef(0);

  const RemoveView = (id) => {
    const vm = viewModels.find(v => v.id === id);
    if (vm) {
      vm.Dispose();
      setViewModels(prevViewModels => prevViewModels.filter(v => v.id !== id));
    }
  };

  const RemoveAllViews = () => {
    viewModels.forEach(v => v.Dispose());
    setViewModels([]);
    lastViewId.current = 0;
  };

  const AddView = (pctTop, pctLeft, pctWidth, pctHeight) => {
    console.log("[AddView] ");
    const newId = lastViewId.current++;
    const newViewModel = new AVRPViewModel(newId, pctTop, pctLeft, pctWidth, pctHeight);
    setViewModels(prevViewModels => [...prevViewModels, newViewModel]);
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
      <div style={{position: 'absolute', width: '100vw', height: '90vh', top: '0', left: '0', backgroundColor: 'purple'}}>
        { viewModels.map((model) => {
          const g = model.GetGeometry();
          const bc = model.GetBackgroundColor();
          return (
            <AVRPView key={model.GetId()} viewId={model.GetId()} 
              pctTop={g.pctTop} pctLeft={g.pctLeft} pctWidth={g.pctWidth} pctHeight={g.pctHeight} 
              rgbBackgroundColor={bc}
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