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
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';

import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import Constants from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

import macro from '@kitware/vtk.js/macro';

import styles from '../../app.module.css'
import GestureCameraManipulator from '@kitware/vtk.js/Interaction/Manipulators/GestureCameraManipulator';
import MouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import MouseCameraTrackballRotateManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballRotateManipulator';

function InteractorStyleImageTouch(publicAPI, model) {
  model.classHierarchy.push('InteractorStyleImageTouch');

  publicAPI.startPan = ()=>console.log("StartPan Override!");

  publicAPI.handleStartPan = (callData) => {
    model.previousTranslation = callData.translation;
    const touches = callData.touches;
    callData['position'] = {
      x: callData.touches[Object.keys(touches)[0]].x,
      y: callData.touches[Object.keys(touches)[0]].y
    }
    model.lastSlicePosition = callData.touches[Object.keys(touches)[0]].y;

    
    publicAPI.startSlice();
    console.log("StartPan state:", model.state);
  }

  publicAPI.superHandleEndPan = publicAPI.handleEndPan;
  publicAPI.handleEndPan = () => {
    console.log("EndPan state:", model.state);
    publicAPI.endSlice();
  }
};

function extend(publicAPI, model, initialValues = {}) {
  vtkInteractorStyleImage.extend(publicAPI, model, initialValues);

  InteractorStyleImageTouch(publicAPI, model);
}

const createImageTouchStyle = macro.newInstance(extend, 'InteractorStyleImageTouch');




const { SlicingMode } = Constants;

export default function Slices() {
  console.log("Render App");
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const hasDownloadingStarted = useRef(false);
  const timeData = useRef([]);
  const [currentTP, setCurrentTP] = useState(1);
  const [nT, setNT] = useState(20);
  const zSlider = useRef(null);
  const [zPosition, setZPosition] = useState(0);
  const [zRange, setZRange] = useState([0, 0]);

  const ViewportPos = {
    top_left: [0, 0.5, 0.5, 1],
    top_right: [0.5, 0.5, 1, 1],
    bottom_left: [0, 0, 0.5, 0.5],
    bottom_right: [0.5, 0, 1, 0.5]
  };

  const slicingConfig = [
    {
      mode: SlicingMode.X, 
      viewportPos: ViewportPos.top_right,
      viewUp: [0, 0, 1],
    }, 
    {
      mode: SlicingMode.Y, 
      viewportPos: ViewportPos.bottom_right,
      viewUp: [0, 0, 1,]
    },
    {
      mode: SlicingMode.Z, 
      viewportPos: ViewportPos.top_left,
      viewUp: [0, -1, 0]
    }
  ];

  // const BASE_URL = 'http://192.168.50.37:8000'
  // const BASE_URL = 'http://10.102.180.67:8000'
  const BASE_URL = 'http://10.102.156.9:8000/'

  const { fetchBinary } = vtkHttpDataAccessHelper;

  function downloadData() {
    console.log("[downloadData] started");
    const files = [
      'dist/volume/ds/img3d_ds_bavcta008_baseline_00.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_01.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_02.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_03.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_04.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_05.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_06.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_07.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_08.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_09.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_10.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_11.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_12.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_13.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_14.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_15.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_16.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_17.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_18.vti',
      'dist/volume/ds/img3d_ds_bavcta008_baseline_19.vti',
    ];
    return Promise.all(
      files.map((fn) => 
        fetchBinary(`${BASE_URL}/${fn}`).then((binary) => {return binary;})
      )
    )
  };

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0.1, 0.1, 0.1],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const iStyle = createImageTouchStyle();
      iStyle.setInteractionMode('IMAGE_SLICING');
      renderWindow.getInteractor().setInteractorStyle(iStyle);

      // Setup 3 renderes for the x, y, z viewports
      const sliceRenderers = [];
      for (let i = 0; i < 3; i++) {
        sliceRenderers.push(vtkRenderer.newInstance());
        renderer.setViewport(...(slicingConfig[i].viewportPos));
        renderWindow.addRenderer(renderer);
      }

      // Setup tp actors
      const tpActors = [];
      for (let t = 0; t < nT; t++) {
        const reader = vtkXMLImageDataReader.newInstance();
        const renderPipelines = [];

        for (let i = 0; i < 3; ++i) {
          const mapper = vtkImageMapper.newInstance();
          const actor = vtkImageSlice.newInstance();

          mapper.setInputConnection(reader.getOutputPort());
          mapper.setSliceAtFocalPoint(true);
          mapper.setSlicingMode(slicingConfig[i].mode);

          actor.setMapper(mapper);
          actor.setVisibility(false);
          sliceRenderers[i].addActor(actor);

          const colorTransferFunction = vtkColorTransferFunction.newInstance();
          colorTransferFunction.addRGBPoint(0, 0, 0, 0);
          colorTransferFunction.addRGBPoint(1, 1, 1, 1);
          actor.getProperty().setRGBTransferFunction(0, colorTransferFunction);

          // const camera = renderer.getActiveCamera();
          // camera.setViewUp(...(slicingConfig[i].viewUp));
          // camera.setParallelProjection(true);
          
          const pipeline = { mapper, actor };
          renderPipelines[i] = pipeline;
        }

        tpActors.push({ reader, renderPipelines });
      }
      
      context.current = {
        fullScreenRenderWindow, renderWindow, tpActors, sliceRenderers,
      };

      if (!hasDownloadingStarted.current) {
        hasDownloadingStarted.current = true;
        downloadData().then((data) => {
          console.log('All Data Downloaded!', data);
          timeData.current = [...data];
          for (let i = 0; i < timeData.current.length; i++) {
            connectDataWithActor(i).then(tp => {
              if (tp === currentTP)
                updateVisibleDataset(true);
            })
          }
          if (context.current) {
            context.current.reader.parseAsArrayBuffer(data[0]);
          }
          updateVisibleDataset();
        })
      }

      window.vtkContext = context.current;
    }

    return () => {
      if (context.current) {
        console.log("<effect>[vtkContainerRef]cleaning up...");
        const { 
          fullScreenRenderWindow, tpActors, sliceRenderers,
        } = context.current;

        fullScreenRenderWindow.delete();

        sliceRenderers.forEach((ren) => {
          ren.delete();
        })

        tpActors.forEach((tp) => {
          const { reader, renderPipelines } = tp;
          renderPipelines.forEach((dim) => {
            const { mapper, actor } = dim;
            mapper.delete();
            actor.delete();
          })
          reader.delete();
        })

        renderPipelines.forEach((e) => {
          const { mapper, actor, renderer } = e;
          mapper.delete();
          actor.delete();
          renderer.delete();
        });

        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  function connectDataWithActor(tp) {
    if (!context.current)
      return;

    const data = timeData.current;
    const { tpActors } = context.current;
    tpActors[tp].reader.parseAsArrayBuffer(data[tp]);
    return Promise.resolve(tp);
  }
  

  function updateVisibleDataset(resetCamera = false) {
    if (context.current) {
      const { renderWindow, tpActors, sliceRenderers } = context.current;

      console.log("Updating visible dataset");

      tpActors.forEach((e, i) => {
        e.actor.setVisibility(i == currentTP);
      })

      if (resetCamera) {
        for (let d = 0; d < 3; d++) {
          const { mapper } = tpActors[currentTP].renderPipelines[d];
          const renderer = sliceRenderers[d]
          const camera = renderer.getActiveCamera();
          const position = camera.getFocalPoint();
  
          // offset along the slicing axis
          const normal = mapper.getSlicingModeNormal();
          position[0] += normal[0];
          position[1] += normal[1];
          position[2] += normal[2];
          camera.setPosition(...position);
          renderer.resetCamera();
        }
      }

      // zSlider.current.min = mapper.getBoundsForSlice()[2];
      // zSlider.current.max = mapper.getBoundsForSlice()[5];
      // zSlider.current.step = 1.0;

      // const iStyle = vtkInteractorStyleImage.newInstance();

      
      renderWindow.render();
    }
    
    // console.log("[setVisibleDataset] timeData.length=", timeData.current.length);
    // if (context.current) {
    //   const { renderWindow, mapper, renderer, actor } = context.current;
    //   mapper.setInputData(ds);
    //   console.log("-- input data set", ds);

    //   mapper.setSampleDistance(1.1);
    //   mapper.setPreferSizeOverAccuracy(true);
    //   mapper.setBlendModeToComposite();
    //   mapper.setIpScalarRange(0.0, 1.0);

    //   const  opacityFunction = vtkPiecewiseFunction.newInstance();
    //   opacityFunction.addPoint(-3024, 0.1);
    //   opacityFunction.addPoint(-637.62, 0.1);
    //   opacityFunction.addPoint(700, 0.5);
    //   opacityFunction.addPoint(3071, 0.9);
    //   actor.getProperty().setScalarOpacity(0, opacityFunction);

    //   const colorTransferFunction = vtkColorTransferFunction.newInstance();
    //   colorTransferFunction.addRGBPoint(0, 0, 0, 0);
    //   colorTransferFunction.addRGBPoint(1, 1, 1, 1);
    //   actor.getProperty().setRGBTransferFunction(0, colorTransferFunction);

    //   actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
    //   actor.getProperty().setInterpolationTypeToLinear();
    //   actor.getProperty().setShade(true);
    //   actor.getProperty().setAmbient(0.1);
    //   actor.getProperty().setDiffuse(0.9);
    //   actor.getProperty().setSpecular(0.2);
    //   actor.getProperty().setSpecularPower(10.0);

    //   renderer.resetCamera();
    //   renderer.getActiveCamera().elevation(-70);
    //   renderWindow.render();
    // }
  }

  // useEffect(() => {
  //   if (context.current) {
  //     context.current.mapper.setZSlice(zPosition);
  //   }
  // }, [zPosition])

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div className={styles.control_panel}>
        <input ref={zSlider} className={styles.touch_slider} type="range"
          value={zPosition}
          onChange={(ev)=>setZPosition(Number(ev.target.value))}
        />
      </div>
    </div>
  );
}