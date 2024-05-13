import { useParams } from "react-router-dom";
import React, {useRef, useEffect} from "react";
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
const { fetchBinary } = vtkHttpDataAccessHelper;
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';


export default function ModelView() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const { dsid } = useParams();

  const dataURL = `http://localhost:7070/data?id=${dsid}`;
  // console.log("[ModelView] dataURL: ", dataURL);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current,
      });

      const reader = vtkXMLPolyDataReader.newInstance();

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(reader.getOutputPort(0));
      mapper.setScalarVisibility(false);

      const actor = vtkActor.newInstance();
      const property = actor.getProperty();
      property.setColor(1, 0.91, 0.8);
      actor.setProperty(property);
      actor.setMapper(mapper);

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderer.addActor(actor);
      renderer.resetCamera();

      fetchBinary(dataURL).then((binary) => {
        // console.log("[ModelView] binary: ", binary);
        reader.parseAsArrayBuffer(binary);
        const polydata = reader.getOutputData(0);
        // console.log("[ModelView] polydata: ", polydata);
        mapper.setInputData(reader.getOutputData(0));
        renderer.resetCamera();
        renderWindow.render();
      });
      

      context.current = {
        fullScreenRenderer,
        renderWindow,
        renderer,
        actor,
        mapper,
      };
    }

    return () => {
      if (context.current) {
        const { fullScreenRenderer, actor, mapper } = context.current;
        actor.delete();
        mapper.delete();
        fullScreenRenderer.delete();
        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  return (
    <div ref={vtkContainerRef}></div>
  );
}