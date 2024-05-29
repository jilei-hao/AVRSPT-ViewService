import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';

function useCoaptationSurfaceRenderingPipeline() {
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


export default function CoaptationSurfaceLayer(props) {
  const { activeTP } = useAVRPViewerState();
  const { getActiveTPData, tpData } = useAVRPData();
  const { renderWindow } = useViewRendering();
  const { addActor, getActor, hasActor } = useCoaptationSurfaceRenderingPipeline();

  const updateRendering = (isInitial) => {
    const coData = getActiveTPData('coaptation-surface');

    if (!coData)
      return;

    const co = coData[0].data;

    if (!hasActor('tri'))
      addActor('tri');

    const actor = getActor('tri');
    const mapper = actor.getMapper();
    mapper.setInputData(co);

    if (isInitial) {
      const property = actor.getProperty();
      property.setOpacity(0.8);
      property.setColor(0, 1, 1);
      actor.setProperty(property);
      renderWindow.getRenderer().addActor(actor);
      renderWindow.getRenderer().resetCamera();
    }
    
    renderWindow.render();
  }

  useEffect(() => {
    updateRendering(true);
  }, [tpData]);

  useEffect(() => {
    updateRendering(false);
  }, [activeTP])

  useEffect(() => {
    return () => {
      const actor = getActor('tri');
      renderWindow.getRenderer().removeActor(actor);
      renderWindow.render();
    }
  }, []);

  return (
    <div className={styles.layerPanelContainer}>
      CoaptaionSurface
    </div>
  );
}