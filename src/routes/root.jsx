import { useState, useRef, useEffect, createContext, useContext} from 'react';

// vtk imports
// -- Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/All';
// -- Force DataAccessHelper to have access to various data source
import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';
// -- rendering
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import Constants from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import vtkActor  from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkLookupTable from '@kitware/vtk.js/Common/Core/LookupTable';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
// -- io
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';

// application imports
import btn_play from '../assets/btn_play__idle.svg'
import btn_prev from '../assets/btn_prev__idle.svg'
import btn_next from '../assets/btn_next__idle.svg'
import btn_pause from '../assets/btn_pause__idle.svg'
import styles from '../app.module.css'
import config from '../../server-config.json';
import { RenderContext } from '../shared/model/context';
import InteractionStyleImageTouch from '../shared/ui/interaction/interaction_style_image_touch';

// -- components
import ViewPanelGroup from '../shared/ui/viewport_panel';
import { 
  canvasBox, viewBoxes, sliceViewMap, viewPanelPos, viewConfig,
  modelViewMap, 
} from "../shared/model/layout"
import { cases, BASE_DATA_URL } from '../shared/model/cases';

const { SlicingMode } = Constants;
const { fetchBinary } = vtkHttpDataAccessHelper;

export default function Root() {
  // console.log("Render App");
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const [contextState, setContextState] = useState(null);
  const hasDownloadingStarted = useRef(false);
  const hasDownloadingFinished = useRef(false);
  const tpVolumeData = useRef([]);
  const tpModelData = useRef([]);
  const tpSegmentationData = useRef([]);
  const tpSlider = useRef(null); // ref to the tp slider
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [currentTP, setCurrentTP] = useState(0); // storage tp is 0-based
  const [frameTimeInMS, setFrameTimeInMS] = useState(50);
  const [replayTimer, setReplayTimer] = useState({});
  const [devMsg, setDevMsg] = useState("");
  const [viewPanelVis, setViewPanelVis] = useState(["visible", "visible", "visible", "visible"]);
  const [crntCase, setCrntCase] = useState("dev_cta-3tp");

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);
      // console.log("-- has download started: ", hasDownloadingStarted.current);
      // console.log("-- has doanload finished: ", hasDownloadingFinished.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0.1, 0.1, 0.1],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const iStyle = InteractionStyleImageTouch.newInstance();
      iStyle.setInteractionMode('IMAGE_SLICING');
      renderWindow.getInteractor().setInteractorStyle(iStyle);

      // Setup 3 renderes for the x, y, z viewports
      const sliceRenderers = [];

      for (let i = 0; i < 3; i++) {
        const renderer = vtkRenderer.newInstance();
        
        const sliceViewConfig = viewConfig[sliceViewMap[i]];
        const sliceRenConfig = sliceViewConfig.renConfig;

        // configure image mapper and actor
        const mapper = vtkImageMapper.newInstance();
        const actor = vtkImageSlice.newInstance();
        mapper.setSliceAtFocalPoint(true);
        mapper.setSlicingMode(sliceRenConfig.mode);
        actor.setMapper(mapper);
        actor.setVisibility(true);
        const colorTransferFunction = vtkColorTransferFunction.newInstance();
        colorTransferFunction.addRGBPoint(0, 0, 0, 0);
        colorTransferFunction.addRGBPoint(1, 1, 1, 1);
        actor.getProperty().setRGBTransferFunction(0, colorTransferFunction);
        actor.getProperty().setColorLevel(130);
        actor.getProperty().setColorWindow(662);

        // configure overlay mapper and actor
        const seg_mapper = vtkImageMapper.newInstance();
        const seg_actor = vtkImageSlice.newInstance();
        seg_mapper.setSliceAtFocalPoint(true);
        seg_mapper.setSlicingMode(sliceRenConfig.mode);
        seg_actor.setMapper(seg_mapper);
        seg_actor.setVisibility(true);
        const seg_lut = vtkColorTransferFunction.newInstance();
        seg_lut.setIndexedLookup(true);
        seg_lut.setMappingRange(0, 4);
        seg_lut.addRGBPoint(0, 0, 0, 0);
        seg_lut.addRGBPoint(1, 1, 0, 0);
        seg_lut.addRGBPoint(2, 0, 1, 0);
        seg_lut.addRGBPoint(3, 0, 0, 1);
        seg_lut.addRGBPoint(4, 1, 0.87, 0.74);

        seg_actor.getProperty().setRGBTransferFunction(0, seg_lut);
        console.log("-- seg_lut: ", seg_actor, seg_lut);
        const ofun = vtkPiecewiseFunction.newInstance();
        ofun.addPoint(0, 0);
        ofun.addPoint(1, 0.8);
        seg_actor.getProperty().setColorLevel(2);
        seg_actor.getProperty().setColorWindow(4);
        seg_actor.getProperty().setScalarOpacity(ofun);
        seg_actor.getProperty().setInterpolationTypeToNearest();
        

        // configure renderer
        renderer.addActor(actor);
        renderer.addActor(seg_actor);
        renderer.set({ 
          rendererType: sliceRenConfig.renType, 
          rendererId: sliceRenConfig.renId,
          viewId: sliceViewConfig.viewId,
          }, true);
        renderer.setViewport(...viewBoxes[sliceViewConfig.position]);

        // configure camera orientation
        const camera = renderer.getActiveCamera();
        camera.setViewUp(...sliceRenConfig.viewUp);
        camera.setParallelProjection(true);

        renderWindow.addRenderer(renderer);
        sliceRenderers.push(renderer);
      }

      // Setup the renderer for the 3d viewport
      const modelRenderer = vtkRenderer.newInstance();
      const modelActor = vtkActor.newInstance();
      const modelMapper = vtkMapper.newInstance();
      const modelViewConfig = viewConfig[modelViewMap[0]];
      const modelRenConfig = modelViewConfig.renConfig;

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
      modelRenderer.setViewport(...viewBoxes[modelViewConfig.position]);
      modelRenderer.resetCamera();
      modelRenderer.set({ 
        rendererType: modelRenConfig.renType, 
        rendererId: modelRenConfig.renId,
        viewId: modelViewConfig.viewId
      }, true);

      renderWindow.addRenderer(modelRenderer);

      // Setup pipelines to render content for each time points
      
      context.current = {
        fullScreenRenderWindow, renderWindow,
        sliceRenderers, modelRenderer,
      };

      const nT = cases[crntCase].nT;

      if (!hasDownloadingStarted.current || hasDownloadingFinished.current) {
        hasDownloadingStarted.current = true;
        hasDownloadingFinished.current = false;

        for (let i = 0; i < nT; i++)
          downloadData(i);
      }

      updateSlider(nT);

      window.vtkContext = context.current;

      // without this context will not be refereshed to the children
      setContextState(context.current); 
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

  function downloadData(tp) {
    console.log("-- downloading started for tp: ", tp);
    parseVolumeFile(cases[crntCase].volumes[tp], tp);
    parseSegmentationFile(cases[crntCase].segmentations[tp], tp);
    parseModelFile(cases[crntCase].models[tp], tp);
  };

  function parseSegmentationFile(fn, i) {
    console.log("parseSegmentationFile: fn", `${BASE_DATA_URL}/${fn}`);
    fetchBinary(`${BASE_DATA_URL}/${fn}`).then((bVolume) => {
      console.log("-- parsing segmentation from file: ", i);
      //setDevMsg(`parsing volume: ${i}`);
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(bVolume);
      tpSegmentationData.current[i] = reader.getOutputData(0);
      reader.delete();

      if (i == currentTP)
        updateVisibleSegmentation(true);
    });

  }

  function parseVolumeFile(fn, i) {
    fetchBinary(`${BASE_DATA_URL}/${fn}`).then((bVolume) => {
      console.log("-- parsing volume from file: ", i);
      //setDevMsg(`parsing volume: ${i}`);
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(bVolume);
      tpVolumeData.current[i] = reader.getOutputData(0);
      reader.delete();

      if (i == currentTP)
        updateVisibleVolume(true);
    });
  }

  function parseModelFile(fn, i) {
    fetchBinary(`${BASE_DATA_URL}/${fn}`).then((bModel) => {
      console.log("-- parsing model from file: ", i);
      //setDevMsg(`parsing model from file: ${i}`);
      const reader = vtkXMLPolyDataReader.newInstance();
      reader.parseAsArrayBuffer(bModel);
      tpModelData.current[i] = reader.getOutputData(0);
      reader.delete();

      if (i == currentTP)
        updateVisibleModel(true);
    });
  }

  function updateVisibleVolume(resetCamera = false) {
    if (context.current) {
      // console.log("updateVisibleVolume data:", tpVolumeData.current[currentTP]);
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

  function updateVisibleSegmentation(resetCamera = false) {
    if (context.current) {
      // console.log("updateVisibleVolume data:", tpVolumeData.current[currentTP]);
      const { sliceRenderers, renderWindow } = context.current;
      // console.log("[updateVisibleSegmentatin] segData: ", tpSegmentationData.current[currentTP]);
      sliceRenderers.forEach((ren) => {
        const actor = ren.getActors()[1];
        // console.log("-- segActor = ", actor)
        const mapper = actor.getMapper();
        mapper.setInputData(tpSegmentationData.current[currentTP]);

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

  function updateVisibleModel(resetCamera = false) {
    if (context.current) {
      //console.log("updateVisibleModel data:", tpModelData.current[currentTP]);
      const { modelRenderer, renderWindow } = context.current;
      const actor = modelRenderer.getActors()[0];
      const mapper = actor.getMapper();
      mapper.setInputData(tpModelData.current[currentTP]);

      if (resetCamera)
        modelRenderer.resetCamera();

      renderWindow.render();
    }
  }

  function updateVisibleDataset(resetCamera = false) {
      // console.log("Updating visible dataset");

      if (tpVolumeData.current.length > 0)
        updateVisibleVolume(resetCamera);
      if (tpModelData.current.length > 0)
        updateVisibleModel(resetCamera);
      if (tpSegmentationData.current.length > 0)
        updateVisibleSegmentation(resetCamera);
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
    const l = cases[crntCase].nT;
    setCurrentTP(prevTP => l - 1 - (l - prevTP) % l);
  }

  function onNextClicked() {
    setCurrentTP(prevTP => (prevTP + 1) % cases[crntCase].nT);
  }

  useEffect(() => {
    clearInterval(replayTimer);
    if (isReplayOn) {
      setReplayTimer(setInterval(onNextClicked, frameTimeInMS));
    }
  }, [frameTimeInMS, isReplayOn]);

  // let viewPanel control other panel's visibility
  function handleLayoutChange(viewId, isFullScreen) {
    console.log("[handleLayoutChange] viewId: ", viewId);
    const thisVis = "visible";
    const otherVis = isFullScreen ? "hidden" : "visible";
    
    let newVis = [otherVis, otherVis, otherVis, otherVis];
    newVis[viewId] = thisVis;
    // console.log(`handleLayoutChange (${viewId}): newVis: `, newVis);

    setViewPanelVis(newVis);
  }

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
      <div className={styles.dev_panel}>
        <p className={styles.dev_message}>{ devMsg }</p>
      </div>
      <RenderContext.Provider value={contextState}>
        <ViewPanelGroup onLayoutChange={handleLayoutChange}
          viewPanelVis={viewPanelVis}
        />
      </RenderContext.Provider>
    </div>
  );
}