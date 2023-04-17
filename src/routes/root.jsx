import { useState, useRef, useEffect, createContext, useContext} from 'react';

// vtk imports
// -- Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Volume';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
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

// application import
import styles from '../app.module.css'
import config from '../../server-config.json';
import { RenderContext } from '../model/context';
import InteractionStyleImageTouch from '../ui/interaction/interaction_style_image_touch';

// -- components
import { cases, BASE_DATA_URL } from '../model/cases';
import { 
  canvasBox, viewBoxes, sliceViewMap, viewPanelPos, viewConfig,
  modelViewMap, 
} from "../model/layout"
import ViewPanelGroup from '../ui/composite/viewport_panel';
import { ReplayPanel } from '../ui/composite/replay_panel';
import ButtonLabel from '../ui/basic/btn_label';
import LabelEditor from '../ui/composite/label_editor';
import { CreateDMPHelper } from '../model';

const { fetchBinary } = vtkHttpDataAccessHelper;

export default function Root() {
  // console.log("Render App");
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const [contextState, setContextState] = useState(null);
  const hasDownloadingStarted = useRef(false);
  const hasDownloadingFinished = useRef(false);
  const tpData = useRef([]);
  const [devMsg, setDevMsg] = useState("");
  const [viewPanelVis, setViewPanelVis] = useState(["visible", "visible", "visible", "visible"]);
  const [crntCaseKey, setCrntCaseKey] = useState("dev_echo100-14tp");
  const [numberOfTimePoints, setNumberOfTimePoints] = useState(1);
  const readyFlagCount = useRef(0);
  const [labelEditorActive, setLabelEditorActive] = useState(false);
  const [initLabelConfig, setInitLabelConfig] = useState(null); // for initializing the label editor

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);
      // console.log("-- has download started: ", hasDownloadingStarted.current);
      // console.log("-- has doanload finished: ", hasDownloadingFinished.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0, 0, 0],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const iStyle = InteractionStyleImageTouch.newInstance();
      iStyle.setInteractionMode('IMAGE_SLICING');
      renderWindow.getInteractor().setInteractorStyle(iStyle);

      // Create DisplayMappingPolicies)
      const DMPHelper = CreateDMPHelper();
      const crntCase = cases[crntCaseKey];
      const labelConf= crntCase.DisplayConfig.LabelConfig;
      setInitLabelConfig(labelConf); // Initialize Label Editor
      let presetKey = labelConf.DefaultColorPresetName;
      if (!(presetKey in labelConf.ColorPresets)) {
        console.error(`[RootPage]: Key ${presetKey} not found in \
        ColorPresets! Using first key instead.`);

        presetKey = Object.keys(labelConf.ColorPresets)[0];
        if (!presetKey) {
          console.error("[RootPage]: Cannot render the page with \
           an empty Color Preset!");
          return;
        }
      }
      const preset = labelConf.ColorPresets[labelConf.DefaultColorPresetName];
      const labelDesc = labelConf.LabelDescription;
      const labelRGBA = DMPHelper.CreateLabelRGBAMap(preset, labelDesc);

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
        actor.getProperty().setRGBTransferFunction(0, DMPHelper.CreateImageColorFunction());
        actor.getProperty().setColorLevel(130);
        actor.getProperty().setColorWindow(662);

        // configure overlay mapper and actor
        const seg_mapper = vtkImageMapper.newInstance();
        const seg_actor = vtkImageSlice.newInstance();
        
        seg_mapper.setSliceAtFocalPoint(true);
        seg_mapper.setSlicingMode(sliceRenConfig.mode);
        seg_actor.setMapper(seg_mapper);
        seg_actor.setVisibility(true);
        seg_actor.getProperty().setRGBTransferFunction(0, DMPHelper.CreateLabelColorFunction(labelRGBA));

        let labelRange = [];
        DMPHelper.GetLabelRange(labelRGBA, labelRange);
        const segColorWindow = labelRange[1] - labelRange[0];
        const segColorLevel = labelRange[0] + segColorWindow / 2;
        seg_actor.getProperty().setColorLevel(segColorLevel);
        seg_actor.getProperty().setColorWindow(segColorWindow);
        seg_actor.getProperty().setScalarOpacity(DMPHelper.CreateLabelOpacityFunction(labelRGBA));
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
      modelMapper.setUseLookupTableScalarRange(true);
      modelMapper.setLookupTable(DMPHelper.CreateLabelColorFunction(labelRGBA));
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

      const nT = cases[crntCaseKey].nT;
      setNumberOfTimePoints(nT);

      if (!hasDownloadingStarted.current || hasDownloadingFinished.current) {
        hasDownloadingStarted.current = true;
        hasDownloadingFinished.current = false;

        for (let i = 0; i < nT; i++)
          downloadData(i);
      }

      // For dev tool troubleshooting
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

  function createNewTimePointData () {
    return {
      volume: null,
      segmentation: null,
      model: null
    }
  };

  function downloadData(tp) {
    console.log("-- downloading started for tp: ", tp);

    if (!tpData.current[tp]) {
      //console.log(`---- creating new tpData[${tp}]`);
      tpData.current[tp] = createNewTimePointData();
    }

    parseVolumeFile(cases[crntCaseKey].volumes[tp], tp);
    parseSegmentationFile(cases[crntCaseKey].segmentations[tp], tp);
    parseModelFile(cases[crntCaseKey].models[tp], tp);
  };

  function updateReadyFlag() {
    readyFlagCount.current++;

    if (readyFlagCount.current == 3)
      updateVisibleDataset(0, true);
  }

  function parseSegmentationFile(fn, i) {
    console.log("parseSegmentationFile: fn", `${BASE_DATA_URL}/${fn}`);
    fetchBinary(`${BASE_DATA_URL}/${fn}`).then((bVolume) => {
      console.log("-- parsing segmentation from file: ", i);
      //setDevMsg(`parsing volume: ${i}`);
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(bVolume);
      tpData.current[i].segmentation = reader.getOutputData(0);
      reader.delete();

      if (i == 0)
        updateReadyFlag();
    });
  }

  function parseVolumeFile(fn, i) {
    fetchBinary(`${BASE_DATA_URL}/${fn}`).then((bVolume) => {
      console.log("-- parsing volume from file: ", i);
      //setDevMsg(`parsing volume: ${i}`);
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(bVolume);
      tpData.current[i].volume = reader.getOutputData(0);
      reader.delete();

      if (i == 0)
        updateReadyFlag();
    });
  }

  function parseModelFile(fn, i) {
    fetchBinary(`${BASE_DATA_URL}/${fn}`).then((bModel) => {
      console.log("-- parsing model from file: ", i);
      //setDevMsg(`parsing model from file: ${i}`);
      const reader = vtkXMLPolyDataReader.newInstance();
      reader.parseAsArrayBuffer(bModel);
      tpData.current[i].model = reader.getOutputData(0);
      reader.delete();

      if (i == 0)
        updateReadyFlag();
    });
  }

  function resetSlicingCamera(renId = -1) {
    const { sliceRenderers } = context.current;
    sliceRenderers.forEach((ren, i) => {
      // only update specified renId, or -1 for all renderer cameras
      if (renId == i || renId == -1) {
        const actor = ren.getActors()[0]; // only image actor needed
        const mapper = actor.getMapper();

        const camera = ren.getActiveCamera();
        const position = camera.getFocalPoint();

        // offset along the slicing axis
        const normal = mapper.getSlicingModeNormal();
        position[0] += normal[0];
        position[1] += normal[1];
        position[2] += normal[2];
        camera.setPosition(...position);
        
        ren.resetCamera();

        if (i != 0)
          camera.zoom(1.4);
        else
          camera.zoom(1.1);
          
      }
    })
  }

  function updateVisibleVolume(tp, resetCamera = false) {
    const volume = tpData.current[tp].volume;

    if (!volume) {
      console.error(`[udpateVisibleVolume] volume for tp ${tp} does not exist!`);
      return;
    }

    const { sliceRenderers } = context.current;
    sliceRenderers.forEach((ren, i) => {
      const actor = ren.getActors()[0];
      const mapper = actor.getMapper();
      mapper.setInputData(volume);
    })

    if (resetCamera) {
      resetSlicingCamera(-1);
    }
  }

  function updateVisibleSegmentation(tp, resetCamera = false) {
    const segmentation = tpData.current[tp].segmentation;

    if (!segmentation) {
      console.error(`[udpateVisibleSegmentation] segmentation for tp ${tp} does not exist!`);
      return;
    }

    const { sliceRenderers } = context.current;
    // console.log("[updateVisibleSegmentatin] segData: ", tpSegmentationData.current[currentTP]);
    sliceRenderers.forEach((ren) => {
      const actor = ren.getActors()[1];
      const mapper = actor.getMapper();
      mapper.setInputData(segmentation);
    })
  }

  function updateVisibleModel(tp, resetCamera = false) {
    const model = tpData.current[tp].model;

    if (!model) {
      console.error(`[updateVisibleModel] model data for tp ${tp} does not exist!`);
      return;
    }

    const { modelRenderer } = context.current;
    const actor = modelRenderer.getActors()[0];
    const mapper = actor.getMapper();
    mapper.setInputData(model);

    if (resetCamera)
      modelRenderer.resetCamera();
  }

  function updateVisibleDataset(tp, resetCamera = false) {
    // console.log("Updating visible dataset");
    if (!context.current)
      return;

    const { renderWindow } = context.current;

    if (!tpData.current[tp]) {
      console.error(`[updateVisibleDataset] timepoint data ${tp} does not exist`);
      return;
    }
      
    updateVisibleVolume(tp, resetCamera);
    updateVisibleModel(tp, resetCamera);
    updateVisibleSegmentation(tp, resetCamera);

    renderWindow.render();
  }


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

  function toggleLabelEditor() {
    setLabelEditorActive(!labelEditorActive);
  }

  function changeLabelOpacity(oFun) {
    const { sliceRenderers, renderWindow } = context.current;
    sliceRenderers.forEach((e) => {
      const actor = e.getActors()[1];
      actor.getProperty().setScalarOpacity(0, oFun);
    })
    renderWindow.render();
  }

  function changeLabelColor(clrFun) {
    const { sliceRenderers, modelRenderer, renderWindow } = context.current;
    sliceRenderers.forEach((e) => {
      const actor = e.getActors()[1];
      actor.getProperty().setRGBTransferFunction(clrFun);
    })

    const modelActor = modelRenderer.getActors()[0];
    modelActor.getMapper().setLookupTable(clrFun);
    
    renderWindow.render();
  }

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div className={styles.dev_panel}>
        <p className={styles.dev_message}>{ devMsg }</p>
      </div>
      <RenderContext.Provider value={contextState}>
        <ViewPanelGroup onLayoutChange={handleLayoutChange}
          viewPanelVis={viewPanelVis}
        />
        <div className={styles.control_panel}>
          <ReplayPanel 
            nT={numberOfTimePoints}
            updateVisibleDataset={updateVisibleDataset}
          />
          <ButtonLabel 
            onClick={toggleLabelEditor}
          />
        </div>
        <LabelEditor
          visible={labelEditorActive} 
          initLabelConfig={initLabelConfig}
          onOpacityChange={changeLabelOpacity}
          onColorChange={changeLabelColor}
        />
      </RenderContext.Provider>
    </div>
  );
}