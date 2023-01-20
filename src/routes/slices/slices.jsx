import { useState, useRef, useEffect } from 'react';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/All';

// Force DataAccessHelper to have access to various data source
import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';

// Model Rendering
import vtkActor  from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkLookupTable from '@kitware/vtk.js/Common/Core/LookupTable';

// Volume and Slice Rendering
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';

import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import Constants from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

import macro from '@kitware/vtk.js/macro';

import styles from '../../app.module.css'
import GestureCameraManipulator from '@kitware/vtk.js/Interaction/Manipulators/GestureCameraManipulator';
import MouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import MouseCameraTrackballRotateManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballRotateManipulator';

import btn_play from '../../assets/btn_play__idle.svg'
import btn_prev from '../../assets/btn_prev__idle.svg'
import btn_next from '../../assets/btn_next__idle.svg'
import btn_pause from '../../assets/btn_pause__idle.svg'
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';

const VIEWPORT_BOUNDS = [0.0, 0.1, 1, 1];

// const BASE_URL = 'http://192.168.50.37:8000'
// const BASE_URL = 'http://10.102.180.67:8000'
// const BASE_URL = 'http://10.102.156.9:8000/'
const BASE_URL = 'http://10.102.172.102:8000/'

const volumeFiles = [
  'dist/volume/ds/img3d_ds_bavcta008_baseline_00.vti',
  'dist/volume/ds/img3d_ds_bavcta008_baseline_01.vti',
  'dist/volume/ds/img3d_ds_bavcta008_baseline_02.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_03.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_04.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_05.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_06.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_07.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_08.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_09.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_10.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_11.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_12.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_13.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_14.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_15.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_16.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_17.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_18.vti',
  // 'dist/volume/ds/img3d_ds_bavcta008_baseline_19.vti',
];

const modelFiles = [
  'dist/model/dc90/mesh_dc90_bavcta008_01.vtp',
  'dist/model/dc90/mesh_dc90_bavcta008_02.vtp',
  'dist/model/dc90/mesh_dc90_bavcta008_03.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_04.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_05.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_06.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_07.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_08.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_09.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_10.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_11.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_12.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_13.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_14.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_15.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_16.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_17.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_18.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_19.vtp',
  // 'dist/model/dc90/mesh_dc90_bavcta008_20.vtp',
];

const nT = volumeFiles.length;

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
  const hasDownloadingFinished = useRef(false);
  const tpVolumeData = useRef([]);
  const tpModelData = useRef([]);
  const tpSlider = useRef(null); // ref to the tp slider
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [currentTP, setCurrentTP] = useState(0); // storage tp is 0-based
  const [frameTimeInMS, setFrameTimeInMS] = useState(50);
  const [replayTimer, setReplayTimer] = useState({});

  const ViewportPos = {
    top_left: [0, 0.55, 0.5, 1],
    top_right: [0.5, 0.55, 1, 1],
    bottom_left: [0, 0.1, 0.5, 0.55],
    bottom_right: [0.5, 0.1, 1, 0.55]
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

  const { fetchBinary } = vtkHttpDataAccessHelper;

  function downloadData(tp) {
    console.log("-- downloading started for tp: ", tp);
    parseVolumeFile(volumeFiles[tp], tp);
    parseModelFile(modelFiles[tp], tp);
  };

  function parseVolumeFile(fn, i) {
    fetchBinary(`${BASE_URL}/${fn}`).then((bVolume) => {
      console.log("-- parsing volume from file: ", i);
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(bVolume);
      tpVolumeData.current[i] = reader.getOutputData(0);
      reader.delete();

      if (i == currentTP)
        updateVisibleVolume(true);
    });
  }

  function updateVisibleVolume(resetCamera = false) {
    if (context.current) {
      console.log("updateVisibleVolume data:", tpVolumeData.current[currentTP]);
      const { sliceRenderers, renderWindow } = context.current;
      sliceRenderers.forEach((ren) => {
        const actor = ren.getActors()[0];
        const mapper = actor.getMapper();
        mapper.setInputData(tpVolumeData.current[currentTP]);

        if (resetCamera) {
          const camera = ren.getActiveCamera();
          const position = camera.getFocalPoint();

          // offset along the slicing axis
          const normal = mapper.getSlicingModeNormal();
          position[0] += normal[0];
          position[1] += normal[1];
          position[2] += normal[2];
          camera.setPosition(...position);
          ren.resetCamera();
        }
      })
      renderWindow.render();
    }
  }

  function parseModelFile(fn, i) {
    fetchBinary(`${BASE_URL}/${fn}`).then((bModel) => {
      console.log("-- parsing model from file: ", i);
      const reader = vtkXMLPolyDataReader.newInstance();
      reader.parseAsArrayBuffer(bModel);
      tpModelData.current[i] = reader.getOutputData(0);
      reader.delete();

      if (i == currentTP)
        updateVisibleModel(true);
    });
  }

  function updateVisibleModel(resetCamera = false) {
    if (context.current) {
      console.log("updateVisibleModel data:", tpModelData.current[currentTP]);
      const { modelRenderer, renderWindow } = context.current;
      const actor = modelRenderer.getActors()[0];
      const mapper = actor.getMapper();
      mapper.setInputData(tpModelData.current[currentTP]);

      if (resetCamera)
        modelRenderer.resetCamera();

      renderWindow.render();
    }
  }

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);
      console.log("-- has download started: ", hasDownloadingStarted.current);
      console.log("-- has doanload finished: ", hasDownloadingFinished.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0.1, 0.1, 0.1],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      // const iStyle = createImageTouchStyle();
      // iStyle.setInteractionMode('IMAGE_SLICING');
      // renderWindow.getInteractor().setInteractorStyle(iStyle);

      // Setup 3 renderes for the x, y, z viewports
      const sliceRenderers = [];
      for (let i = 0; i < 3; i++) {
        const renderer = vtkRenderer.newInstance();
        const mapper = vtkImageMapper.newInstance();
        const actor = vtkImageSlice.newInstance();

        mapper.setSliceAtFocalPoint(true);
        mapper.setSlicingMode(slicingConfig[i].mode);

        actor.setMapper(mapper);
        actor.setVisibility(true);
        const colorTransferFunction = vtkColorTransferFunction.newInstance();
        colorTransferFunction.addRGBPoint(0, 0, 0, 0);
        colorTransferFunction.addRGBPoint(1, 1, 1, 1);
        actor.getProperty().setRGBTransferFunction(0, colorTransferFunction);

        renderer.addActor(actor);

        sliceRenderers.push(renderer);
        renderer.setViewport(...(slicingConfig[i].viewportPos));
        const camera = renderer.getActiveCamera();
        camera.setViewUp(...(slicingConfig[i].viewUp));
        camera.setParallelProjection(true);
        renderWindow.addRenderer(renderer);
      }

      // Setup the renderer for the 3d viewport
      const modelRenderer = vtkRenderer.newInstance();
      const modelActor = vtkActor.newInstance();
      const modelMapper = vtkMapper.newInstance();
      modelRenderer.addActor(modelActor);
      modelActor.setMapper(modelMapper);
      modelMapper.setScalarRange(2.9, 3.1);

      const lut = vtkLookupTable.newInstance();
      lut.setNumberOfColors(2);
      lut.setAboveRangeColor([1,0.87,0.74,1]);
      lut.setBelowRangeColor([1,1,1,1]);
      lut.setNanColor([1,0.87,0.74,1]);
      lut.setUseAboveRangeColor(true);
      lut.setUseBelowRangeColor(true);
      lut.build();
      modelMapper.setLookupTable(lut);
      modelRenderer.setViewport(ViewportPos.bottom_left);
      modelRenderer.resetCamera();
      renderWindow.addRenderer(modelRenderer);

      // Setup pipelines to render content for each time points
      
      context.current = {
        fullScreenRenderWindow, renderWindow,
        sliceRenderers, modelRenderer,
      };

      if (!hasDownloadingStarted.current || hasDownloadingFinished.current) {
        hasDownloadingStarted.current = true;
        hasDownloadingFinished.current = false;

        for (let i = 0; i < nT; i++)
          downloadData(i);
      }

      updateSlider(nT);

      window.vtkContext = context.current;
    }

    return () => {
      if (context.current) {
        console.log("<effect>[vtkContainerRef]cleaning up...");
        const { 
          fullScreenRenderWindow, sliceRenderers, modelRenderer,
        } = context.current;

        fullScreenRenderWindow.delete();
        sliceRenderers.forEach((ren) => ren.delete());
        modelRenderer.delete();

        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  function updateVisibleDataset(resetCamera = false) {
      console.log("Updating visible dataset");

      if (tpVolumeData.current.length > 0)
        updateVisibleVolume(resetCamera);
      if (tpModelData.current.length > 0)
        updateVisibleModel(resetCamera);
  }

  function updateSlider(len) {
    if (context.current && tpSlider.current) {
      const slider = tpSlider.current;
      slider.min = 1;
      slider.max = len;
    }
  }

  useEffect(() => {
    if (context.current) {
      console.log("Current TP Changed to: ", currentTP);
      updateVisibleDataset();
    }
  }, [currentTP]);

  function onReplayClicked() {
    setIsReplayOn(!isReplayOn);
  }

  function onPreviousClicked() {
    const l = nT;
    setCurrentTP(prevTP => l - 1 - (l - prevTP) % l);
  }

  function onNextClicked() {
    setCurrentTP(prevTP => (prevTP + 1) % nT);
  }

  useEffect(() => {
    clearInterval(replayTimer);
    if (isReplayOn) {
      setReplayTimer(setInterval(onNextClicked, frameTimeInMS));
    }
  }, [frameTimeInMS, isReplayOn]);

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div className={styles.control_panel}>
        <div className={styles.replay_panel}>
          <button className={styles.toolbar_button__s}
            onClick={onPreviousClicked}
          >
            <img className={styles.icon_image__s} src={ btn_prev }/>
          </button>
          <input className={styles.touch_slider} ref={tpSlider}
            type="range" min="1" max="1"
            value={currentTP + 1}
            onChange={(ev) => setCurrentTP(Number(ev.target.value - 1))}
          />
          <button className={styles.toolbar_button__s}
            onClick={onNextClicked}
          >
            <img className={styles.icon_image__s} src={ btn_next }/>
          </button>
          <button className={styles.toolbar_button__s}
            onClick={onReplayClicked}
          >
            <img className={styles.icon_image__s} 
            src={ isReplayOn ? btn_pause : btn_play } />
          </button>
        </div>
      </div>
    </div>
  );
}



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