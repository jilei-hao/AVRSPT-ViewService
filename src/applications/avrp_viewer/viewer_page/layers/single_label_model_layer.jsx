import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
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

  useEffect(() => {
    console.log("[SingleLabelModelLayer] useEffect[], activeTP: ", activeTP);
    const model = getActiveTPData('single-label-model');

    if (!model)
      return;

    console.log("[SingleLabelModelLayer] model: ", model);

    if (!hasActor('model'))
      addActor('model');

    const actor = getActor('model');
    const mapper = actor.getMapper();
    console.log("[SingleLabelModelLayer] mapper: ", mapper);
    mapper.setInputData(model);
    actor.setMapper(mapper);

    renderWindow.getRenderer().addActor(actor);
    renderWindow.getRenderer().resetCamera();
    renderWindow.render();

    
  }, [tpData, activeTP]);


  return (
    <div className={styles.layerPanelContainer}>
    </div>
  );
}