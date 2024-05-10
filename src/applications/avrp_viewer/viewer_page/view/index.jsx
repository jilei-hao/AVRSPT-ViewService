import React, { createContext, useRef, useEffect, useState } from 'react';
import GenericRenderWindow from '@/rendering/GenericRenderingWindow';
import styles from './styles.module.css';

const ViewRenderingContext = createContext();

function ViewRenderingProvider({ containerRef, children }) {
  const [renderWindow, setRenderWindow] = useState(GenericRenderWindow.newInstance());

  useEffect(() => {
    renderWindow.setContainer(containerRef.current);
  }, [containerRef])

  return (
    <ViewRenderingContext.Provider value={{renderWindow}}>
      { children }
    </ViewRenderingContext.Provider>
  );
}

export default function View({ pctTop, pctLeft, pctWidth, pctHeight, children}) {
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
    <ViewRenderingProvider containerRef={containerRef}>
      <div className={styles.viewContainer} style={style} ref={containerRef}>
        <div className={styles.layerPanelContainer}>
          { children }
        </div>
      </div>
    </ViewRenderingProvider>
  );
}