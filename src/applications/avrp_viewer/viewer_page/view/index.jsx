import React, { createContext, useRef, useEffect, useState } from 'react';
import GenericRenderWindow from '@/rendering/GenericRenderingWindow';
import styles from './styles.module.css';
import { SingleLabelModelLayer, CoaptationSurfaceLayer } from '../layers';
import { MultiSelectDropdown } from '@viewer/components';
import SingleSelectDropdown from '../../components/single_select_dropdown';

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

const isLayerVisibleByMode = (modes, layerId, modeId) => {
  const selectedMode = modes.find((mode) => mode.id === modeId);

  if (!selectedMode)
    return false;

  return selectedMode.layers.includes(layerId);
}

const getUpdatedLayerMenuOptions = (layers, modes, modeId) => {
  const selectedMode = modes.find((mode) => mode.id === modeId);

  if (!selectedMode)
    return [];

  const modeLayers = selectedMode.layers.map((layerId) => {
    console.log("-- layerId: ", layerId);
    const layer = layers.find((_layer) => _layer.id === layerId);
    return layer ? layer.name : '';
  });

  return modeLayers;
}

export default function View({ viewHeader }) {
  const { id, layers, modes } = viewHeader;
  const { pctTop, pctLeft, pctWidth, pctHeight } = viewHeader.geometry;
  const containerRef = useRef();
  const [selectedModeId, setSelectedModeId] = useState(1);

  const [layerConfigs, setLayerConfigs] = useState(layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    type: layer.type,
    visible: isLayerVisibleByMode(modes, layer.id, selectedModeId),
  })));

  // get list of layers from the selected mode
  const [layerMenuOptions, setLayerMenuOptions] = useState(getUpdatedLayerMenuOptions(layers, modes, 1));

  useEffect(() => {
    console.log("[View]: layerMenuOptions: ", layerMenuOptions);
  }, [layerMenuOptions]);

  const style = {
    position: 'absolute',
    top: `${pctTop}%`,
    left: `${pctLeft}%`,
    width: `${pctWidth}%`,
    height: `${pctHeight}%`,
    border: '1px solid white',
  };

  const handleModeChange = (modeName) => {
    const mode = modes.find((mode) => mode.name === modeName);
    setSelectedModeId(mode.id);
    const _options = getUpdatedLayerMenuOptions(layers, modes, mode.id);
    setLayerMenuOptions(_options);
    setLayerVisibilityByMode(mode.id);
  }

  const handleLayerMenuOptionChange = (selectedLayerNames) => {
    console.log("[View] Layer menu option changed: ", selectedLayerNames);
    const _layerConfigs = layerConfigs.map((lc) => {
      return {
        ...lc,
        visible: selectedLayerNames.includes(lc.name),
      }
    });
    setLayerConfigs(_layerConfigs);
  }

  // set visibility of layers based on the selected mode
  const setLayerVisibilityByMode = (modeId) => {
    const selectedMode = modes.find((mode) => mode.id === modeId);

    if (!selectedMode)
      return;

    const _layerConfigs = layerConfigs.map((lc) => {
      return {
        ...lc,
        visible: isLayerVisibleByMode(modes, lc.id, modeId),
      }
    });

    setLayerConfigs(_layerConfigs);
  }

  return (
    <ViewRenderingProvider containerRef={containerRef} viewId={id}>
      <div className={styles.viewContainer} style={style}>
        <div className={styles.renderWindowContainer} ref={containerRef} />
        <div className={styles.layerPanelContainer}>
          {
            layerConfigs.map((lc) => {
              if (!lc.visible)
                return '';

              switch(lc.type) {
                case 'model-sl':
                  return <SingleLabelModelLayer key={lc.id} name={lc.name}/>;
                case 'coaptation-surface':
                  return <CoaptationSurfaceLayer key={lc.id} name={lc.name}/>;
                default:
                  return '';
              }})
          }
        </div>
        <div className={styles.viewModePanelContainer}>
          <MultiSelectDropdown 
            options={layerMenuOptions} 
            selectedOptions={ layerMenuOptions.filter((option) => layerConfigs.find((lc) => lc.name === option && lc.visible))}
            onOptionsChange={ handleLayerMenuOptionChange }
            menuTitle="Layers"
          />
          <SingleSelectDropdown
            options={modes.map((mode) => mode.name)} 
            selectedOption={ 
              modes.find((mode) => mode.id === selectedModeId) ? 
                modes.find((mode) => mode.id === selectedModeId).name : ''}
            onOptionChange={ handleModeChange }
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