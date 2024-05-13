import React, { createContext, useRef, useEffect, useState } from 'react';
import GenericRenderWindow from '@/rendering/GenericRenderingWindow';
import styles from './styles.module.css';

const ViewRenderingContext = createContext();

function usePersistentRenderWindows() {
  const renderWindowsRef = useRef(new Map());

  const getRenderWindow = (id) => {
    if (!renderWindowsRef.current.has(id)) {
      renderWindowsRef.current.set(id, GenericRenderWindow.newInstance());
    }

    return renderWindowsRef.current.get(id);
  }

  return getRenderWindow;
}

function ViewRenderingProvider({ viewId, containerRef, children }) {
  const getRenderWindow = usePersistentRenderWindows();
  const [renderWindow, ] = useState(getRenderWindow(viewId));

  const registerProp = (prop) => {
    // get a new key
    // add prop to the propRegister
    // add prop to the renderWindow
    // return key to the caller
  }

  useEffect(() => {
    renderWindow.setContainer(containerRef.current);
  }, [containerRef])

  return (
    <ViewRenderingContext.Provider value={{renderWindow}}>
      { children }
    </ViewRenderingContext.Provider>
  );
}

export default function View({ pctTop, pctLeft, pctWidth, pctHeight, viewId, children}) {
  const containerRef = useRef();

  const style = {
    position: 'absolute',
    top: `${pctTop}%`,
    left: `${pctLeft}%`,
    width: `${pctWidth}%`,
    height: `${pctHeight}%`,
    backgroundColor: 'green',
    border: '1px solid white',
  };

  return (
    <ViewRenderingProvider containerRef={containerRef} viewId={viewId}>
      <div className={styles.viewContainer} style={style} ref={containerRef}>
        <div className={styles.layerPanelContainer}>
          { children }
        </div>
        <div className={styles.viewModePanelContainer}>
        </div>
      </div>
    </ViewRenderingProvider>
  );
}