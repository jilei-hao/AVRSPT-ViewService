import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import RoundSlider from '@ui/basic/rounder_slider';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';

function useSingleLabelModelRenderingPipeline() {
  const actorMap = useRef(new Map());
  
  const addActor = (key) => {
    const actor = vtkActor.newInstance();

    const mapper = vtkMapper.newInstance();
    mapper.setScalarVisibility(false);
    actor.setMapper(mapper);

    actorMap.current.set(key, actor);
    return actor;
  }

  const getActor = (key) => {
    return actorMap.current.get(key);
  }

  const hasActor = (key) => {
    return actorMap.current.has(key);
  }

  return { addActor, getActor, hasActor };
}


export default function SingleLabelModelLayer(props) {
  const { activeTP } = useAVRPViewerState();
  const { getActiveTPData, tpData } = useAVRPData();
  const { renderWindow } = useViewRendering();
  const { addActor, getActor, hasActor } = useSingleLabelModelRenderingPipeline();
  const renderingInitialized = useRef(false);

  const updateRendering = (isInitial) => {
    const modelSLData = getActiveTPData('model-sl');

    if (!modelSLData)
      return;

    const modelSL = modelSLData[0].data;

    if (!hasActor('model'))
      addActor('model');

    const actor = getActor('model');
    const mapper = actor.getMapper();
    mapper.setInputData(modelSL);

    if (isInitial) {
      renderWindow.getRenderer().addActor(actor);
      renderWindow.getRenderer().resetCamera();
      renderingInitialized.current = true;
    }

    renderWindow.render();
  }

  useEffect(() => {
    updateRendering(!renderingInitialized.current);
  }, [tpData]);

  useEffect(() => {
    updateRendering(false);
  }, [activeTP]);

  const handleOpacityChange = (e) => {
    const opacity = e.target.value;
    const actor = getActor('model');
    const property = actor.getProperty();
    property.setOpacity(opacity);
    actor.setProperty(property);
    renderWindow.render();
  }

  useEffect(() => {
    return () => {
      const actor = getActor('model');
      renderWindow.getRenderer().removeActor(actor);
      renderWindow.render();
    }
  }, []);


  return (
    <div className={styles.layerPanelContainer}>
      <RoundSlider min={0} max={1} step={.01} onChange={handleOpacityChange} />
    </div>
  );
}