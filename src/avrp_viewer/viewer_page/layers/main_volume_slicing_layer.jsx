import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';


function useMainVolumeSlicingRenderingPipeline(slicingMode) {
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

function getGreyImageColorLevelAndWindow(imageData) {
  const range = imageData.getPointData().getScalars().getRange();
  const window = (range[1] - range[0]) / 2;
  const level = range[0] + (range[1] - range[0]) / 2;
  return { level, window };
}

export default function MainVolumeSlicingLayer({ slicingMode }) {
  const { activeTP } = useAVRPViewerState();
  const { getActiveTPData, tpData } = useAVRPData();
  const { renderWindow, resetSlicingCamera } = useViewRendering();
  const { addActor, getActor, hasActor, getAllActors } = useMainVolumeSlicingRenderingPipeline(slicingMode);
  const renderingInitialized = useRef(false);
  const dataKey = 'volume-main';

  const updateRendering = (isInitial) => {
    const mainVolumeData = getActiveTPData(dataKey);

    // console.log(`[MainVolumeSlicingLayer${slicingMode}]: updateRendering: `, isInitial);

    if (!mainVolumeData || mainVolumeData.length == 0)
      return;

    const { data } = mainVolumeData[0];
    if (!hasActor(dataKey))
      addActor(dataKey);

    const actor = getActor(dataKey);
    const mapper = actor.getMapper();
    mapper.setInputData(data);
    mapper.setSliceAtFocalPoint(true);

      
    if (isInitial) {
      const { level, window } = getGreyImageColorLevelAndWindow(data);
      actor.getProperty().setColorWindow(window);
      actor.getProperty().setColorLevel(level);
      renderWindow.getRenderer().addActor(actor);
      resetSlicingCamera(data.getBounds(), mapper.getSlicingModeNormal(), mapper.getSlicingMode())
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
      <h1>MainSlicing: {slicingMode}</h1>
    </div>
  );
}