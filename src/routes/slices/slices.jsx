import { useState, useRef, useEffect } from 'react';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

// Force DataAccessHelper to have access to various data source
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';

import styles from '../../app.module.css'

export default function Slices() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const [hasDataDownloaded, setHasDataDownloaded] = useState(false);

  const BASE_URL = 'https://kitware.github.io/vtk-js/data/volume/'

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const renderer = fullScreenRenderWindow.getRenderer();

      const imageActorI = vtkImageSlice.newInstance();
      const imageActorJ = vtkImageSlice.newInstance();
      const imageActorK = vtkImageSlice.newInstance();

      // const testActor = vtkActor.newInstance();
      // renderer.addActor(testActor);
      // const coneSource = vtkConeSource.newInstance({
      //   center: [0, 0, 0],
      //   height: 50.0,
      // });
      // const mapper = vtkMapper.newInstance();
      // mapper.setInputData(coneSource);
      // testActor.setMapper(mapper);

      renderer.addActor(imageActorK);
      renderer.addActor(imageActorJ);
      renderer.addActor(imageActorI);
      
      const imageMapperI = vtkImageMapper.newInstance();
      const imageMapperJ = vtkImageMapper.newInstance();
      const imageMapperK = vtkImageMapper.newInstance();

      console.log("imageActorI(outside) isDeleted: ", imageActorI.isDeleted());


      if (!hasDataDownloaded) {
        const reader = vtkHttpDataSetReader.newInstance({
          fetchGzip: true,
        });
        reader.setUrl(`${BASE_URL}/headsq.vti`, { loadData: true })
          .then(() => {
            if (!imageActorI || imageActorI.isDeleted())
            {
              console.log("Page re-rendered, abandoning data loading");
              return;
            }

            const data = reader.getOutputData();
            const dataRange = data.getPointData().getScalars().getRange();
            const extent = data.getExtent();

            console.log("Data Retrieved: ", data);
            console.log("dataRange: ", dataRange);
            console.log("extent:", extent);
            
            imageMapperI.setInputData(data);
            imageMapperI.setISlice(30);
            imageActorI.setMapper(imageMapperI);
            console.log("slice I set");

            imageMapperJ.setInputData(data);
            imageMapperJ.setJSlice(30);
            imageActorJ.setMapper(imageMapperJ);
            console.log("slice J set");

            imageMapperK.setInputData(data);
            imageMapperK.setKSlice(30);
            imageActorK.setMapper(imageMapperK);
            console.log("slice K set");

            // Set Color Window and Level
            updateColorLevel((Range[1] + Range[2]) / 2);
            updateColorWindow((Range[1]));

            renderer.resetCamera();
            renderer.resetCameraClippingRange();

            renderWindow.render();

            console.log("render called");
            setHasDataDownloaded(true);
          }
        );
      }

      context.current = {
        fullScreenRenderWindow,
        renderWindow,
        renderer,
        imageActorI,
        imageActorJ,
        imageActorK,
        imageMapperI,
        imageMapperJ,
        imageMapperK
      };

      window.vtkContext = context;
    }

    return () => {
      if (context.current) {
        console.log("container ref cleaning up...", context.current)
        const { fullScreenRenderWindow, imageActorI, imageActorJ, imageActorK, 
          imageMapperI, imageMapperJ, imageMapperK } = context.current;
        imageActorI.delete();
        imageActorJ.delete();
        imageActorK.delete();
        imageMapperI.delete();
        imageMapperJ.delete();
        imageMapperK.delete();
        fullScreenRenderWindow.delete();
        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  function updateColorLevel(level) {
    if (context.current) {
      const {imageActorI, imageActorJ, imageActorK, renderWindow} = context.current;
      imageActorI.getProperty().setColorLevel(level);
      imageActorJ.getProperty().setColorLevel(level);
      imageActorK.getProperty().setColorLevel(level);

      renderWindow.render();
    }
  }
  
  function updateColorWindow(window) {
    if (context.current) {
      const {imageActorI, imageActorJ, imageActorK, renderWindow} = context.current;
      imageActorI.getProperty().setColorWindow(window);
      imageActorJ.getProperty().setColorWindow(window);
      imageActorK.getProperty().setColorWindow(window);

      renderWindow.render();
    }
  }

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div className={styles.control_panel}>
        <button>Button</button>
      </div>
    </div>
  );
}