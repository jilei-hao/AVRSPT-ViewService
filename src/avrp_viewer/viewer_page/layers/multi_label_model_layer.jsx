import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';


function useMultiLabelModelRenderingPipeline() {
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

  const getAllActors = () => {
    return Array.from(actorMap.current.values());
  }

  const getActorMapEntries = () => {
    return Array.from(actorMap.current.entries());
  }

  return { addActor, getActor, hasActor, getAllActors };
}

export default function MultiLabelModelLayer() {
  const { activeTP } = useAVRPViewerState();
  const { getActiveTPData, tpData } = useAVRPData();
  const { renderWindow } = useViewRendering();
  const { addActor, getActor, hasActor, getAllActors } = useMultiLabelModelRenderingPipeline();

  const updateRendering = (isInitial) => {
    const modelMLData = getActiveTPData('model-ml');

    if (!modelMLData)
      return;

    modelMLData.forEach((labelModel) => {
      const {primary_index, data} = labelModel;
      if (!hasActor(primary_index))
        addActor(primary_index);

      const actor = getActor(primary_index);
      const mapper = actor.getMapper();
      mapper.setInputData(data);

      if (isInitial)
        renderWindow.getRenderer().addActor(actor);
    });

    if (isInitial)
      renderWindow.getRenderer().resetCamera();

    renderWindow.render();
  }

  useEffect(() => {
    updateRendering(true);
  }, [tpData]);

  useEffect(() => {
    updateRendering(false);
  }, [activeTP]);

  useEffect(() => {
    return () => {
      getAllActors().forEach(actor => {
        renderWindow.getRenderer().removeActor(actor);
      });
      renderWindow.getRenderer().resetCamera();
      renderWindow.render();
    }
  }, []);

  return (
    <div>
      <h1>MultiLabelModelLayer</h1>
    </div>
  );
}