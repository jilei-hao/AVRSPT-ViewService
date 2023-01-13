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

  publicAPI.handleStartPan = (callData) => {
    model.previousTranslation = callData.translation;
    const touches = callData.touches;
    model.lastSlicePosition = callData.touches[Object.keys(touches)[0]].y;

    console.log("StartPan callData:", touches[Object.keys(touches)[0]]);
    publicAPI.startSlice();
  }

  publicAPI.superHandleEndPan = publicAPI.handleEndPan;
  publicAPI.handleEndPan = () => {
    console.log("EndPan");
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

  const BASE_URL = 'http://192.168.50.37:8000'
  // const BASE_URL = 'http://10.102.180.67:8000'

  const { fetchBinary } = vtkHttpDataAccessHelper;

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0.1, 0.1, 0.1],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();

      const reader = vtkXMLImageDataReader.newInstance();

      const renderPipelines = [];

      for (let i = 0; i < 3; ++i) {
        const mapper = vtkImageMapper.newInstance();
        const actor = vtkImageSlice.newInstance();
        const renderer = vtkRenderer.newInstance();

        mapper.setInputConnection(reader.getOutputPort());
        mapper.setSliceAtFocalPoint(true);
        mapper.setSlicingMode(slicingConfig[i].mode);

        actor.setMapper(mapper);
        renderer.addActor(actor);
        renderer.setViewport(...(slicingConfig[i].viewportPos));
        renderWindow.addRenderer(renderer);

        const camera = renderer.getActiveCamera();
        camera.setViewUp(...(slicingConfig[i].viewUp));
        camera.setParallelProjection(true);
        
        const pipeline = { mapper, actor, renderer };
        renderPipelines[i] = pipeline;
      }
      
      context.current = {
        fullScreenRenderWindow, renderWindow, reader, 
        renderPipelines,
      };

      if (!hasDownloadingStarted.current) {
        hasDownloadingStarted.current = true;
        downloadData().then((data) => {
          console.log('Data Downloaded!', data[0]);
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
          fullScreenRenderWindow, reader, renderPipelines,
        } = context.current;

        reader.delete();
        fullScreenRenderWindow.delete();
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

  function downloadData() {
    console.log("[downloadData] started");
    const files = [
      'dist/volume/ds/img3d_ds_bavcta008_baseline_00.vti'
    ];
    return Promise.all(
      files.map((fn) => 
        fetchBinary(`${BASE_URL}/${fn}`).then((binary) => {
          return binary;
        })
      )
    )
  };

  function updateVisibleDataset() {
    if (context.current) {
      const { renderWindow, renderPipelines } = context.current;

      console.log("Updating visible dataset");

      for (let i = 0; i < 3; i++) {
        const { mapper, actor, renderer } = renderPipelines[i];
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

      // zSlider.current.min = mapper.getBoundsForSlice()[2];
      // zSlider.current.max = mapper.getBoundsForSlice()[5];
      // zSlider.current.step = 1.0;

      // const iStyle = vtkInteractorStyleImage.newInstance();
      const iStyle = createImageTouchStyle();
      iStyle.setInteractionMode('IMAGE_SLICING');
      renderWindow.getInteractor().setInteractorStyle(iStyle);

      // const iStyle = vtkInteractorStyleManipulator.newInstance();
      // const gm = GestureCameraManipulator.newInstance();
      // gm.setRotateEnabled(false);
      // gm.setPanEnabled(false);
      // gm.onStartPan(()=>console.log("onStartPan"));

      // const mm = MouseCameraTrackballRotateManipulator.newInstance();
      // mm.setButton(3);
      // mm.setShift(false);
      // mm.setControl(false);
      // mm.setAlt(false);
      // mm.setDragEnabled(true);

      // console.log("mm: ", mm);

      // // mm.setScrollEnabled(false);
      // // mm.setDragEnabled(true);
      

      // console.log("gm: ", gm);
      
      // iStyle.removeAllManipulators();
      // //iStyle.addGestureManipulator(gm);
      // iStyle.addMouseManipulator(mm);
      // renderWindow.getInteractor().setInteractorStyle(iStyle);
      

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