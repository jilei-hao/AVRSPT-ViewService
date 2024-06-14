import React, { createContext, useRef, useEffect, useState } from 'react';
import GenericRenderWindow from '@/rendering/GenericRenderingWindow';
import styles from './styles.module.css';
import { 
  SingleLabelModelLayer,
  CoaptationSurfaceLayer,
  MultiLabelModelLayer,
  MainVolumeSlicingLayer,
  SegVolumeSlicingLayer
} from '../layers';
import { MultiSelectDropdown, SingleSelectDropdown } from '@viewer/components';
import IconLayers_Idle from '@assets/icons/layers_idle.svg';
import Constants from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import InteractorStyleImageTouch from '@interaction/InteractorStyleImageTouch';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkBoundingBox from '@kitware/vtk.js/Common/DataModel/BoundingBox';
import { M } from '@kitware/vtk.js/macros2';
const { SlicingMode } = Constants;

const ViewRenderingContext = createContext();

function usePersistentRenderWindows() {
  const renderWindowsRef = useRef(new Map());

  const getRenderWindow = (id) => {
    if (!renderWindowsRef.current.has(id)) {
      const renderWindow = GenericRenderWindow.newInstance();
      renderWindow.getRenderer().setBackground(0, 0, 0);
      renderWindowsRef.current.set(id, renderWindow);
    }

    return renderWindowsRef.current.get(id);
  }

  return getRenderWindow;
}

function getInteractorStyle(interactorMode) {
  switch(interactorMode) {
    case 'slicing':{
      const iStyle = InteractorStyleImageTouch.newInstance();
      iStyle.setInteractionMode('IMAGE_SLICING');
      return iStyle;
    }
    case 'trackball':
      return vtkInteractorStyleTrackballCamera.newInstance();
    default:
      return vtkInteractorStyleTrackballCamera.newInstance();
  }
}


function ViewRenderingProvider({ viewId, containerRef, children, renderConfig }) {
  const getRenderWindow = usePersistentRenderWindows();
  const [renderWindow, ] = useState(getRenderWindow(viewId));
  const { interactorMode, cameraConfig } = renderConfig;

  useEffect(() => {
    renderWindow.setContainer(containerRef.current);
    renderWindow.getInteractor().setInteractorStyle(getInteractorStyle(interactorMode));

    // expose renderWindow to the global scope for debugging
    if (!window.renderWindows) {
      window.renderWindows = new Map();
    }
    // add renderWindow to the map with viewId as the key
    window.renderWindows.set(viewId, renderWindow);
  }, [containerRef])

  const resetSlicingCamera = (bounds, slicingNormal, slicingMode) => {
    const camera = renderWindow.getRenderer().getActiveCamera();
    camera.setFocalPoint(...vtkBoundingBox.getCenter(bounds));
    const position = camera.getFocalPoint();
    position[0] += slicingNormal[0];
    position[1] += slicingNormal[1];
    position[2] += slicingNormal[2];
    camera.setPosition(...position);

    switch (slicingMode) {
      case SlicingMode.X:
        camera.setViewUp([0, 0, -1]);
        camera.setParallelScale((bounds[1] - bounds[0]) / 2);
        break;
      case SlicingMode.Y:
        camera.setViewUp([1, -1, 0]);
        camera.setParallelScale((bounds[5] - bounds[4]) / 2);
        break;
      case SlicingMode.Z:
        camera.setViewUp([0, -1, 1]);
        camera.setParallelScale((bounds[1] - bounds[0]) / 2);
        break;
      default:
    }
    camera.setParallelProjection(true);
  }


  return (
    <ViewRenderingContext.Provider value={{renderWindow, resetSlicingCamera}}>
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
    const layer = layers.find((_layer) => _layer.id === layerId);
    return layer ? layer.name : '';
  });

  return modeLayers;
}

const getSlicingMode = (slicingModeStr) => {
  switch(slicingModeStr) {
    case 'X':
      return SlicingMode.X;
    case 'Y':
      return SlicingMode.Y;
    case 'Z':
      return SlicingMode.Z;
    default:
      return SlicingMode.Z;
  }
}

const getRenderConfig = (slicingModeStr) => {
  return {
    interactorMode: slicingModeStr=='none' ? 'trackball' : 'slicing',
  }
}

export default function View({ viewHeader }) {
  const { id, slicingMode, layers, modes } = viewHeader;
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
    <ViewRenderingProvider containerRef={containerRef} viewId={id}
      renderConfig={getRenderConfig(slicingMode)}>
      <div className={styles.viewContainer} style={style}>
        <div className={styles.renderWindowContainer} ref={containerRef} />
        <div className={styles.viewLayerPanelContainer}>
          {
            layerConfigs.map((lc) => {
              if (!lc.visible)
                return '';

              switch(lc.type) {
                case 'model-sl':
                  return <SingleLabelModelLayer key={lc.id} name={lc.name}/>;
                case 'coaptation-surface':
                  return <CoaptationSurfaceLayer key={lc.id} name={lc.name}/>;
                case 'model-ml':
                  return <MultiLabelModelLayer key={lc.id} name={lc.name}/>;
                case 'volume-main-slicing':
                  return <MainVolumeSlicingLayer key={lc.id} name={lc.name} slicingMode={getSlicingMode(slicingMode)}/>;
                case 'volume-seg-slicing':
                  return <SegVolumeSlicingLayer key={lc.id} name={lc.name} slicingMode={getSlicingMode(slicingMode)}/>;
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
            menuTitle={<img src={IconLayers_Idle} style={{width: '32px', height: '32px', objectFit: 'contain'}} />}
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