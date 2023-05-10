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
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
// -- io
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';

// application import
import styles from '../app.module.css'
import { RenderContext } from '../model/context';
import InteractionStyleImageTouch from '../ui/interaction/interaction_style_image_touch';
import config from "../../server-config.json"

// -- components
import { studyData, studyHeaders} from '../model/studies';
import { viewBoxes, sliceViewMap, viewConfig, modelViewMap } from "../model/layout"
import ViewPanelGroup from '../ui/composite/viewport_panel';
import { ReplayPanel } from '../ui/composite/replay_panel';
import ButtonLabel from '../ui/basic/btn_label';
import LabelEditor from '../ui/composite/label_editor';
import { CreateDMPHelper } from '../model';
import ButtonStudy from '../ui/basic/btn_study';
import StudyMenu from '../ui/composite/study_menu';

const { fetchBinary } = vtkHttpDataAccessHelper;
const enumDataType = {
  vol: 0,
  seg: 1,
  mdl: 2,
  count: 3,
}

export default function Root() {
  // console.log("Render App");
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const [contextState, setContextState] = useState(null);
  const [devMsg, setDevMsg] = useState("");
  const [viewPanelVis, setViewPanelVis] = useState(["visible", "visible", "visible", "visible"]);
  
  const [numberOfTimePoints, setNumberOfTimePoints] = useState(1);
  const [labelEditorActive, setLabelEditorActive] = useState(false);
  const [initLabelConfig, setInitLabelConfig] = useState(null); // for initializing the label editor
  const [studyMenuActive, setStudyMenuActive] = useState(false);
  const [initStudyConfig, setInitStudyConfig] = useState(null);

  const tpSegData = useRef([]);
  const tpVolData = useRef([]);
  const tpMdlData = useRef([]);
  const loadingStatus = useRef([]);
  const renderInitialized = useRef(false);
  const refNT = useRef(0);
  // dev_echo-14tp; dev_cta-18tp; case_230424-1tp
  const [crntStudyKey, setCrntStudyKey] = useState("dev_echo-14tp"); 
  const refStudyKey = useRef(crntStudyKey)
  const renderingId = useRef(0);

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      console.log("rebuilding context...", context.current);

      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0, 0, 0],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const iStyle = InteractionStyleImageTouch.newInstance();
      iStyle.setInteractionMode('IMAGE_SLICING');
      renderWindow.getInteractor().setInteractorStyle(iStyle);

      // Initialize Study Menu
      setInitStudyConfig(studyHeaders);

      // Initialize Label Editor
      const crntStudy = studyData[crntStudyKey];
      const labelConf= crntStudy.DisplayConfig.LabelConfig;
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

      // Setup 3 renderes for the x, y, z viewports
      const sliceRenderers = [];

      for (let i = 0; i < 3; i++) {
        const renderer = vtkRenderer.newInstance();
        const sliceViewConfig = viewConfig[sliceViewMap[i]];
        const sliceRenConfig = sliceViewConfig.renConfig;

        // configure renderer
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
      const modelViewConfig = viewConfig[modelViewMap[0]];
      const modelRenConfig = modelViewConfig.renConfig;
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
        id: renderingId.current,
        fullScreenRenderWindow, renderWindow,
        sliceRenderers, modelRenderer,
      };
      renderingId.current++; // increment current context id

      // load default study
      resetRenderingProps(); // this is necessary because dev reload (won't affect prod)
      loadStudy(crntStudyKey);

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

  function resetLoadingStatus(nT) {
    console.log("[resetLoadingStatus] nT=", nT);
    renderInitialized.current = false;
    loadingStatus.current = [];

    for (let i = 0; i < nT; i++) {
      loadingStatus.current.push([false, false, false])
    }
  }

  function attemptInitialRendering() {
    if (checkTPLoadingStatus(0)) {
      renderInitialized.current = true;
      updateVisibleDataset(0, true);
    }
  }

  function checkTPLoadingStatus(tp) {
    const ls = loadingStatus.current[tp];
    return ls[0] && ls[1] && ls[2];
  }

  function updateLoadingStatus(tp, type) {
    if (tp >= refNT.current || type < 0 || type >= enumDataType.count)
      return;
    
    loadingStatus.current[tp][type] = true;

    if (!renderInitialized.current)
      attemptInitialRendering();
  }

  function hasLoadingCompleted() {
    console.log("[hasLoadingCompleted] status: ", loadingStatus.current);
    const nT = refNT.current;
    if (nT == 0)
      return true;

    for(let i = 0; i < nT; i++) {
      if (!checkTPLoadingStatus(i))
        return false;
    }

    return true;
  }

  function getDataServiceUrl() {
    return `http://${config.host}:${config.port}`;
  }

  function loadSeg(url, tp) {
    fetchBinary(url).then((binary) => {
      console.log("-- parsing segmentation from file: ", url);

      // read and fill tpSegData
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(binary);
      tpSegData.current[tp] = reader.getOutputData(0);
      reader.delete();

      updateLoadingStatus(tp, enumDataType.seg);
    });
  }

  function loadVol(url, tp) {
    fetchBinary(url).then((binary) => {
      console.log("-- parsing volume from file: ", url)
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(binary);
      tpVolData.current[tp] = reader.getOutputData(0);
      reader.delete();

      updateLoadingStatus(tp, enumDataType.vol);
    });
  }

  function loadMdl(url, tp) {
    fetchBinary(url).then((binary) => {
      console.log("-- parsing model from file: ", url);
      const reader = vtkXMLPolyDataReader.newInstance();
      reader.parseAsArrayBuffer(binary);
      tpMdlData.current[tp] = reader.getOutputData(0);
      reader.delete();

      updateLoadingStatus(tp, enumDataType.mdl);
    });
  }

  function resetAllTPData() {
    tpVolData.current.forEach((e) => e.delete());
    tpSegData.current.forEach((e) => e.delete());
    tpMdlData.current.forEach((e) => e.delete());

    tpVolData.current = [];
    tpSegData.current = [];
    tpMdlData.current = [];
  }

  function deleteAllActors(renderer) {
    const oldActors = renderer.getActors();
    renderer.removeAllActors();
    oldActors.forEach((e) => e.delete()); // clear memory
  }

  // Remove existing props in the renderers and replace them with new ones
  function resetRenderingProps() {
    console.log("[resetRenderingProps]");
    if (!context.current)
      return;

    const study = studyData[refStudyKey.current];
    const { sliceRenderers, modelRenderer } = context.current;

    // reset model props
    deleteAllActors(modelRenderer);
    const modelActor = vtkActor.newInstance();
    const modelMapper = vtkMapper.newInstance();
    modelActor.setMapper(modelMapper);
    modelRenderer.addActor(modelActor);
    applyModelDMP(modelActor, study.DisplayConfig.LabelConfig);

    // reset slicing props
    sliceRenderers.forEach((ren, ind) => {
      deleteAllActors(ren);
      // volume slicing props
      const sliceRenConfig = viewConfig[sliceViewMap[ind]].renConfig;
      const volumeMapper = vtkImageMapper.newInstance();
      const volumeActor = vtkImageSlice.newInstance();
      volumeMapper.setSliceAtFocalPoint(true);
      volumeMapper.setSlicingMode(sliceRenConfig.mode);
      volumeActor.set({actorType: "vol"}, true);
      volumeActor.setMapper(volumeMapper);
      ren.addActor(volumeActor);
      applyGreyImageDMP(volumeActor, study.DisplayConfig.ImageConfig);

      // segmentation props
      const segMapper = vtkImageMapper.newInstance();
      const segActor = vtkImageSlice.newInstance();
      
      segMapper.setSliceAtFocalPoint(true);
      segMapper.setSlicingMode(sliceRenConfig.mode);
      segActor.set({actorType: "seg"}, true);
      segActor.setMapper(segMapper);
      ren.addActor(segActor);

      applySegmentationDMP(segActor, study.DisplayConfig.LabelConfig);
    })

  }

  function loadStudy(name) {
    setStudyMenuActive(false); // turn off study menu
    console.log("[loadStudy] name=", name);

    if (!hasLoadingCompleted()) {
      console.log("-- previous loading has not completed. abort loading");
      return;
    }
      
    const newStudy = studyData[name];
    const nT = newStudy.nT;

    setNumberOfTimePoints(nT);
    refNT.current = nT;
    setCrntStudyKey(name);
    refStudyKey.current = name;

    resetLoadingStatus(nT);
    resetRenderingProps();
    resetAllTPData();
    
    for (let i = 0; i < nT; i++) {
      const volUrl = `${getDataServiceUrl()}/${newStudy.vol[i]}`
      loadVol(volUrl, i);
      
      const segUrl = `${getDataServiceUrl()}/${newStudy.seg[i]}`
      loadSeg(segUrl, i);

      const mdlUrl = `${getDataServiceUrl()}/${newStudy.mdl[i]}`
      loadMdl(mdlUrl, i);
    }
  }

  function resetSlicingCamera(renId = -1) {
    const { sliceRenderers } = context.current;
    sliceRenderers.forEach((ren, i) => {
      // only update specified renId, or -1 for all renderer cameras
      if (renId == i || renId == -1) {
        const actor = ren.getActors()[0]; // only image actor needed
        const mapper = actor.getMapper();
        const data = mapper.getInputData();

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

  function applyGreyImageDMP(actor, imgConfig) {
    const DMPHelper = CreateDMPHelper();

    actor.getProperty().setRGBTransferFunction(0, DMPHelper.CreateImageColorFunction());
    actor.getProperty().setColorLevel(imgConfig.ColorLevel);
    actor.getProperty().setColorWindow(imgConfig.ColorWindow);
  }

  function applySegmentationDMP(actor, labelConfig) {
    const DMPHelper = CreateDMPHelper();
    const defaultPreset = labelConfig.ColorPresets[labelConfig.DefaultColorPresetName];
    const labelRGBA = DMPHelper.CreateLabelRGBAMap(defaultPreset, labelConfig.LabelDescription)
    const labelRange = DMPHelper.GetLabelRange(labelRGBA);
    const clrWindow = labelRange[1] - labelRange[0];
    const clrLevel = labelRange[0] + clrWindow / 2;
    actor.getProperty().setColorWindow(clrWindow);
    actor.getProperty().setColorLevel(clrLevel);
    actor.getProperty().setScalarOpacity(DMPHelper.CreateLabelOpacityFunction(labelRGBA));
    actor.getProperty().setRGBTransferFunction(0, DMPHelper.CreateLabelColorFunction(labelRGBA));
    actor.getProperty().setInterpolationTypeToNearest();
    actor.setVisibility(true);
  }

  function applyModelDMP(actor, labelConfig) {
    const DMPHelper = CreateDMPHelper();
    const mapper = actor.getMapper();
    mapper.setUseLookupTableScalarRange(true);
    const defaultPreset = labelConfig.ColorPresets[labelConfig.DefaultColorPresetName];
    const labelRGBA = DMPHelper.CreateLabelRGBAMap(defaultPreset, labelConfig.LabelDescription)
    mapper.setLookupTable(DMPHelper.CreateLabelColorFunction(labelRGBA))
  }

  function updateVisibleVolume(tp, resetCamera = false) {
    const volume = tpVolData.current[tp];

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
    const segmentation = tpSegData.current[tp];

    if (!segmentation) {
      console.error(`[udpateVisibleSegmentation] segmentation for tp ${tp} does not exist!`);
      return;
    }

    const { sliceRenderers } = context.current;
    sliceRenderers.forEach((ren) => {
      const actor = ren.getActors()[1];
      const mapper = actor.getMapper();
      mapper.setInputData(segmentation);
    })
  }

  function updateVisibleModel(tp, resetCamera = false) {
    const model = tpMdlData.current[tp];

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
    if (!context.current)
      return;

    const { renderWindow } = context.current;
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
  function toggleStudyMenu() {
    setStudyMenuActive(!studyMenuActive);
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
          <ButtonStudy
            onClick={toggleStudyMenu}
            btnText={crntStudyKey}
          />
        </div>
        <LabelEditor
          visible={labelEditorActive} 
          initLabelConfig={initLabelConfig}
          onOpacityChange={changeLabelOpacity}
          onColorChange={changeLabelColor}
        />
        <StudyMenu
          visible={studyMenuActive}
          initStudyConfig={initStudyConfig}
          onStudyChange={loadStudy}
        />
      </RenderContext.Provider>
    </div>
  );
}