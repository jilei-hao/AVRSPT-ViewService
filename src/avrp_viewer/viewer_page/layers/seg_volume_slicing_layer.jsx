import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import { useLabelDMP } from '@logic/display_mapping_policies';
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

function applySegmentationDMP (actor, labelRGBA) {
  const { 
    createLabelColorFunction,
    createLabelOpacityFunction,
    normalizeLabelRGBA,
    getLabelRange
  } = useLabelDMP();

  const normRGBA = normalizeLabelRGBA(labelRGBA);
  const range = getLabelRange(labelRGBA);
  const clrWindow = range[1] - range[0];
  const clrLevel = range[0] + clrWindow / 2;

  const p = actor.getProperty();

  p.setColorWindow(clrWindow);
  p.setColorLevel(clrLevel);
  p.setRGBTransferFunction(0, createLabelColorFunction(normRGBA));
  p.setScalarOpacity(createLabelOpacityFunction(normRGBA));
  p.setInterpolationTypeToNearest();

}

export default function SegVolumeSlicingLayer({ slicingMode }) {
  const { activeTP, labelRGBA } = useAVRPViewerState();
  const { getActiveTPData, tpData } = useAVRPData();
  const { renderWindow, resetSlicingCamera } = useViewRendering();
  const { addActor, getActor, hasActor, getAllActors } = useSegVolumeSlicingRenderingPipeline(slicingMode);
  const renderingInitialized = useRef(false);
  const dataKey = 'volume-segmentation';

  const updateRendering = (isInitial) => {
    const segVolumeData = getActiveTPData(dataKey);

    // console.log(`[SegVolumeSlicingLayer${slicingMode}]: updateRendering: `);

    if (!segVolumeData)
      return;

    const { data } = segVolumeData[0];
    if (!hasActor(dataKey))
      addActor(dataKey);

    const actor = getActor(dataKey);
    const mapper = actor.getMapper();
    mapper.setInputData(data);
    applySegmentationDMP(actor, labelRGBA);
      
    if (isInitial) {
      renderWindow.getRenderer().addActor(actor);
      resetSlicingCamera(data.getBounds(), mapper.getSlicingModeNormal(), mapper.getSlicingMode());
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
      <h1>SegVolumeSlicingLayer</h1>
    </div>
  );
}