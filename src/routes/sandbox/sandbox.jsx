import { useState, useRef, useEffect } from 'react';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
//import '@kitware/vtk.js/Rendering/Profiles/Geometry';
//import '@kitware/vtk.js/Rendering/Profiles/Volume';
import '@kitware/vtk.js/Rendering/Profiles/All';

// Force DataAccessHelper to have access to various data source
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';

import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkRTAnalyticSource from '@kitware/vtk.js/Filters/Sources/RTAnalyticSource';

import styles from '../../app.module.css'

export default function Example() {
  console.log("Render App");
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const hasDownloadingStarted = useRef(false);
  const timeData = useRef([]);
  const [currentTP, setCurrentTP] = useState(1);

  const { fetchBinary } = vtkHttpDataAccessHelper;

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0.1, 0.1, 0.1],
      });

      const reader = vtkXMLImageDataReader.newInstance();
      const mapper = vtkVolumeMapper.newInstance();
      
      //mapper.setInputData(vtkRTAnalyticSource.newInstance());
      mapper.setInputConnection(reader.getOutputPort());

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const renderer = fullScreenRenderWindow.getRenderer();
      const interactor = renderWindow.getInteractor();
      interactor.setDesiredUpdateRate(15.0);

      const actor = vtkVolume.newInstance();
      actor.setMapper(mapper);
      renderer.addVolume(actor);

      if (!hasDownloadingStarted.current) {
        hasDownloadingStarted.current = true;
        downloadData().then((downloadedData) => {
          console.log("Data Downloaded: ", downloadedData);
          timeData.current = [...downloadedData];
          setVisibleDataset(timeData.current[currentTP - 1]);
        });
      }
      
      context.current = {
        fullScreenRenderWindow,
        renderWindow,
        renderer,
        actor,
        mapper,
        reader,
      };

      window.vtkContext = context.current; // for browser debugging
    }

    return () => {
      if (context.current) {
        const { 
          fullScreenRenderWindow, actor, mapper, reader,
        } = context.current;

        reader.delete();
        actor.delete();
        mapper.delete();
        fullScreenRenderWindow.delete();
        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  function setVisibleDataset(ds) {
    if (context.current) {
      const { renderWindow, mapper, renderer, actor, reader } = context.current;
      //mapper.setInputData(ds);
      console.log("[setVisibleDataset] input data: ", ds);
      reader.parseAsArrayBuffer(ds);
      
      mapper.setSampleDistance(1.1);
      mapper.setPreferSizeOverAccuracy(true);
      mapper.setBlendModeToComposite();
      mapper.setIpScalarRange(0.0, 1.0);

      const  opacityFunction = vtkPiecewiseFunction.newInstance();
      opacityFunction.addPoint(-3024, 0.1);
      opacityFunction.addPoint(-637.62, 0.1);
      opacityFunction.addPoint(700, 0.5);
      opacityFunction.addPoint(3071, 0.9);
      actor.getProperty().setScalarOpacity(0, opacityFunction);

      const colorTransferFunction = vtkColorTransferFunction.newInstance();
      colorTransferFunction.addRGBPoint(0, 0, 0, 0);
      colorTransferFunction.addRGBPoint(1, 1, 1, 1);
      actor.getProperty().setRGBTransferFunction(0, colorTransferFunction);

      actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
      actor.getProperty().setInterpolationTypeToLinear();
      actor.getProperty().setShade(true);
      actor.getProperty().setAmbient(0.1);
      actor.getProperty().setDiffuse(0.9);
      actor.getProperty().setSpecular(0.2);
      actor.getProperty().setSpecularPower(10.0);

      renderer.resetCamera();
      renderer.getActiveCamera().elevation(-70);
      renderWindow.render();
    }
  }

  function downloadData() {
    console.log("[downloadData] started");
    const files = [
      'dist/img3d_bavcta008_baseline_00.vti'
    ];
    return Promise.all(
      files.map((fn) => 
        fetchBinary(`${BASE_URL}/${fn}`).then((binary) => {
          // const reader = vtkXMLImageDataReader.newInstance();
          // reader.parseAsArrayBuffer(binary);
          return binary;
        })
      )
    )
  };

  //const BASE_URL = 'http://192.168.50.37:8000'
  const BASE_URL = 'http://10.102.180.67:8000'
  
  function downloadSample() {
    console.log("[downloadSample] started");
    const files = [
      'sample/headsq.vti'
    ];
    const httpReader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });
    return Promise.all(
      files.map((fn) => 
        httpReader.setUrl(`${BASE_URL}/${fn}`).then(() => {
          return httpReader.getOutputData(0);
        })
      )
    );
  }

  function onRenderClicked() {
    if (context.current) {
      console.log("[onRenderClicked] timeData: ", timeData);
      const {renderWindow } = context.current;
      setVisibleDataset(timeData.current[currentTP - 1]);
      renderWindow.render();
    }
  }

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div className={styles.control_panel}>
        <button onClick={onRenderClicked}>
          Manual Render
        </button>
      </div>
    </div>
  );
}