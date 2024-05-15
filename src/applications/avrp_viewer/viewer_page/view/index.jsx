import React, { createContext, useRef, useEffect, useState } from 'react';
import GenericRenderWindow from '@/rendering/GenericRenderingWindow';
import styles from './styles.module.css';
import { SingleLabelModelLayer, CoaptationSurfaceLayer } from '../layers';
import { MultiSelectDropdown } from '@viewer/components';

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

  useEffect(() => {
    renderWindow.setContainer(containerRef.current);
  }, [containerRef])

  return (
    <ViewRenderingContext.Provider value={{renderWindow}}>
      { children }
    </ViewRenderingContext.Provider>
  );
}

export default function View({ viewHeader }) {
  const { id, layers } = viewHeader;
  const { pctTop, pctLeft, pctWidth, pctHeight } = viewHeader.geometry;
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
    <ViewRenderingProvider containerRef={containerRef} viewId={id}>
      <div className={styles.viewContainer} style={style}>
        <div className={styles.renderWindowContainer} ref={containerRef} />
        <div className={styles.layerPanelContainer}>
          {
            layers.map((layer) => {
              switch(layer.type) {
                case 'model-sl':
                  return <SingleLabelModelLayer key={layer.id} name={layer.name}/>;
                case 'coaptation-surface':
                  return <CoaptationSurfaceLayer key={layer.id} name={layer.name}/>;
                default:
                  return '';
              }})
          }
        </div>
        <div className={styles.viewModePanelContainer}>
          <MultiSelectDropdown 
            options={['model-sl', 'co-surface', 'model-ml']} 
            selectedOptions={['model-sl']}
            onOptionChange={(options) => console.log("Options changed: ", options)}
            menuTitle="Layers"
          />
          <MultiSelectDropdown 
            options={['anatomy', 'coaptation-surface', 'measurement']} 
            selectedOptions={['coaptation-surface']}
            onOptionChange={(options) => console.log("Options changed: ", options)}
            menuTitle="Modes"
          />
        </div>
      </div>
    </ViewRenderingProvider>
  );
}

export function useViewRendering() {
  return React.useContext(ViewRenderingContext);
}