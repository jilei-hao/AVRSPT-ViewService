import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';


function useSegVolumeSlicingRenderingPipeline(slicingMode) {
  const actorMap = useRef(new Map());
  
  const addActor = (key) => {
    const actor = vtkImageSlice.newInstance();
    const mapper = vtkImageMapper.newInstance();
    mapper.setSliceAtFocalPoint(true);
    mapper.setSlicingMode(slicingMode);
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

export default function SegVolumeSlicingLayer({ slicingMode }) {
  const { activeTP } = useAVRPViewerState();
  const { getActiveTPData, tpData } = useAVRPData();
  const { renderWindow } = useViewRendering();
  const { addActor, getActor, hasActor, getAllActors } = useSegVolumeSlicingRenderingPipeline(slicingMode);
  const dataKey = 'volume-main';

  const updateRendering = (isInitial) => {
    const mainVolumeData = getActiveTPData(dataKey);

    if (!mainVolumeData)
      return;

    const { data } = mainVolumeData;
    if (!hasActor(dataKey))
      addActor(dataKey);

    const actor = getActor(dataKey);
    const mapper = actor.getMapper();
    mapper.setInputData(data);
      
    if (isInitial) {
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
      <h1>SegVolumeSlicingLayer</h1>
    </div>
  );
}