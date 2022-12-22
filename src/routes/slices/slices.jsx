import { useState, useRef, useEffect } from 'react';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import '@kitware/vtk.js/Rendering/Profiles/Volume';

// Force DataAccessHelper to have access to various data source
import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor  from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkRTAnalyticSource from '@kitware/vtk.js/Filters/Sources/RTAnalyticSource';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';

import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import Constants from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

import styles from '../../app.module.css'

const { SlicingMode } = Constants;

export default function Slices() {
  console.log("Render App");
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const hasDownloadingStarted = useRef(false);
  const timeData = useRef([]);
  const [currentTP, setCurrentTP] = useState(1);

  //const BASE_URL = 'http://192.168.50.37:8000'
  const BASE_URL = 'http://10.102.180.67:8000'

  const { fetchBinary } = vtkHttpDataAccessHelper;

  function setVisibleDataset(ds) {
    console.log("[setVisibleDataset] timeData.length=", timeData.current.length);
    if (context.current) {
      const { renderWindow, mapper, renderer, actor } = context.current;
      mapper.setInputData(ds);
      console.log("-- input data set", ds);

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
          const reader = vtkXMLImageDataReader.newInstance();
          reader.parseAsArrayBuffer(binary);
          return reader.getOutputData(0);
        })
      )
    )
  };

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

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0.1, 0.1, 0.1],
      });

      const mapper = vtkVolumeMapper.newInstance();
      mapper.setInputData(vtkImageData.newInstance());

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const renderer = fullScreenRenderWindow.getRenderer();
      const interactor = renderWindow.getInteractor();
      interactor.setDesiredUpdateRate(15.0);

      const actor = vtkVolume.newInstance();
      actor.setMapper(mapper);
      //renderer.addVolume(actor);

      // const coneActor = vtkActor.newInstance();
      // const coneMapper = vtkMapper.newInstance();
      // const cone = vtkConeSource.newInstance({height: 10});
      // coneMapper.setInputConnection(cone.getOutputPort());
      // coneActor.setMapper(coneActor);
      // renderer.addActor(coneActor);

      const rtSource = vtkRTAnalyticSource.newInstance();
      rtSource.setWholeExtent(0, 200, 0, 200, 0, 200);
      rtSource.setCenter(100, 100, 100);
      rtSource.setStandardDeviation(0.3);

      const rtMapper = vtkImageMapper.newInstance();
      rtMapper.setInputConnection(rtSource.getOutputPort());
      rtMapper.setSliceAtFocalPoint(true);
      rtMapper.setSlicingMode(SlicingMode.Z);
      // mapper.setZSlice(5);

      const rgb = vtkColorTransferFunction.newInstance();
      rgb.addRGBPoint(0, 0, 0, 0);
      rgb.addRGBPoint(255, 1, 1, 1);

      const ofun = vtkPiecewiseFunction.newInstance();
      ofun.addPoint(0, 1);
      ofun.addPoint(150, 1);
      ofun.addPoint(180, 0);
      ofun.addPoint(255, 0);

      const rtActor = vtkImageSlice.newInstance();
      rtActor.getProperty().setColorWindow(255);
      rtActor.getProperty().setColorLevel(127);
      // Uncomment this if you want to use a fixed colorwindow/level
      // actor.getProperty().setRGBTransferFunction(rgb);

      rtActor.getProperty().setPiecewiseFunction(ofun);
      rtActor.setMapper(rtMapper);
      renderer.addActor(rtActor);

      

      const iStyle = vtkInteractorStyleImage.newInstance();
      iStyle.setInteractionMode('IMAGE_SLICING');
      renderWindow.getInteractor().setInteractorStyle(iStyle);

      const camera = renderer.getActiveCamera();
      const position = camera.getFocalPoint();
      // offset along the slicing axis
      const normal = rtMapper.getSlicingModeNormal();
      position[0] += normal[0];
      position[1] += normal[1];
      position[2] += normal[2];
      camera.setPosition(...position);
      switch (rtMapper.getSlicingMode()) {
        case SlicingMode.X:
          camera.setViewUp([0, 1, 0]);
          break;
        case SlicingMode.Y:
          camera.setViewUp([1, 0, 0]);
          break;
        case SlicingMode.Z:
          camera.setViewUp([0, 1, 0]);
          break;
        default:
      }
      camera.setParallelProjection(true);
      renderer.resetCamera();
      renderWindow.render();


      // if (!hasDownloadingStarted.current) {
      //   hasDownloadingStarted.current = true;
      //   downloadSample().then((downloadedData) => {
      //     console.log("Data Downloaded: ", downloadedData);
      //     timeData.current = downloadedData;
      //     //setVisibleDataset(timeData.current[currentTP - 1]);
      //   });
      // }
      
      context.current = {
        fullScreenRenderWindow,
        renderWindow,
        renderer,
        actor,
        mapper,
        // cone,
        // coneMapper,
        // coneActor,
        rtActor,
        rtMapper,
        rtSource,
      };

      window.vtkContext = context.current;
    }

    return () => {
      if (context.current) {
        console.log("<effect>[vtkContainerRef]cleaning up...");

        const { 
          fullScreenRenderWindow, actor, mapper, renderer,
          //cone, coneMapper, coneActor,
          rtActor, rtMapper, rtSource,
        } = context.current;

        // cone.delete();
        // coneMapper.delete();
        // coneActor.delete();
        rtSource.delete();
        rtMapper.delete();
        rtActor.delete();
        actor.delete();
        mapper.delete();
        renderer.delete();
        fullScreenRenderWindow.delete();
        context.current = null;
      }
    };
  }, [vtkContainerRef]);

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