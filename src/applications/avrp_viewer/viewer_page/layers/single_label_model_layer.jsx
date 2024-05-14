import styles from './styles.module.css';
import React, { useEffect } from 'react';
import { useAVRPData } from '../avrp_data_context';
import { useViewRendering } from '../view';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';


export default function SingleLabelModelLayer(props) {
  const { tpData } = useAVRPData();
  const { renderWindow } = useViewRendering();

  useEffect(() => {
    if (tpData.length === 0) 
      return;

    console.log("[SingleLabelModelLayer] useEffect[], tpData: ", tpData);
    const model = tpData[0].singleLabelModel;
    console.log("[SingleLabelModelLayer] model: ", model);

    const mapper = vtkMapper.newInstance();
    mapper.setInputData(model);
    mapper.setScalarVisibility(false);

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    renderWindow.getRenderer().addActor(actor);
    renderWindow.getRenderer().resetCamera();
    renderWindow.render();

    
  }, [tpData]);


  return (
    <div className={styles.layerPanelContainer}>
    </div>
  )
}