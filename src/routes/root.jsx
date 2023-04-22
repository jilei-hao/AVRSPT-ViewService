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
import { RenderContext } from '../model/context';
import InteractionStyleImageTouch from '../ui/interaction/interaction_style_image_touch';
import config from "../../server-config.json"

// -- components
import { studyData, studyHeaders} from '../model/studies';
import { 
  canvasBox, viewBoxes, sliceViewMap, viewPanelPos, viewConfig,
  modelViewMap, 
} from "../model/layout"
import ViewPanelGroup from '../ui/composite/viewport_panel';
import { ReplayPanel } from '../ui/composite/replay_panel';
import ButtonLabel from '../ui/basic/btn_label';
import LabelEditor from '../ui/composite/label_editor';
import { CreateDMPHelper } from '../model';
import ButtonStudy from '../ui/basic/btn_study';
import StudyMenu from '../ui/composite/study_menu';
import { F, P } from '@kitware/vtk.js/Common/Core/Math/index';

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
  const isDownloading = useRef(false);
  const hasDownloadingFinished = useRef(false);
  const tpData = useRef([]);
  const [devMsg, setDevMsg] = useState("");
  const [viewPanelVis, setViewPanelVis] = useState(["visible", "visible", "visible", "visible"]);
  
  const [numberOfTimePoints, setNumberOfTimePoints] = useState(1);
  const readyFlagCount = useRef(0);
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
      const DMPHelper = CreateDMPHelper();
      const crntStudy = studyData[crntStudyKey];
      const labelConf= crntStudy.DisplayConfig.LabelConfig;
      const imgConf = crntStudy.DisplayConfig.ImageConfig;
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
      // const modelActor = vtkActor.newInstance();
      // const modelMapper = vtkMapper.newInstance();
      const modelViewConfig = viewConfig[modelViewMap[0]];
      const modelRenConfig = modelViewConfig.renConfig;

      // modelRenderer.addActor(modelActor);
      // modelActor.setMapper(modelMapper);
      // modelMapper.setUseLookupTableScalarRange(true);
      // modelMapper.setLookupTable(DMPHelper.CreateLabelColorFunction(labelRGBA));
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

      // load default study
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
      updateVisibleDataset(0, true, true);
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
    modelMapper.setUseLookupTableScalarRange(true);
    modelActor.setMapper(modelMapper);
    modelRenderer.addActor(modelActor);
    applyModelDMP(modelActor, modelMapper, study);

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
      volumeActor.setVisibility(true);

      // segmentation props
      const segMapper = vtkImageMapper.newInstance();
      const segActor = vtkImageSlice.newInstance();
      
      segMapper.setSliceAtFocalPoint(true);
      segMapper.setSlicingMode(sliceRenConfig.mode);
      segActor.set({actorType: "seg"}, true);
      segActor.setMapper(segMapper);
      segActor.setVisibility(true);
      applySegmentationDMP(segActor, segMapper, study);
    })

  }

  function loadStudy(name) {
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
    resetAllTPData();
    resetRenderingProps();
    applyStudyDMP(newStudy);

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
        console.log("[resetSlicingCamera] dataBounds = ", data.getBounds());

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

  function getSegActorFromRenderer(renderer) {
    const key = "actorType";
    renderer.getActors().forEach((e) => {
      const type = e.get(key)[key];
      if (type == "seg")
        return e;
    });
    return null;
  }

  function getVolActorFromRenderer(renderer) {
    const key = "actorType";
    renderer.getActors().forEach((e) => {
      const type = e.get(key)[key];
      if (type == "vol")
        return e;
    });
    return null;
  }

  function applyStudyDMP(study) {
    const imageConfig = study.DisplayConfig.ImageConfig;
    const labelConfig = study.DisplayConfig.LabelConfig;
    const { sliceRenderers, modelRenderer } = context.current;

    sliceRenderers.forEach((ren) => {
      const volActor = getVolActorFromRenderer(ren);
      if (volActor)
        applyGreyImageDMP(volActor, imageConfig);

      const segActor = getSegActorFromRenderer(ren);
      if (segActor)
        applySegmentationDMP(segActor, labelConfig);
    });

    const mdlActor = modelRenderer.getActors()[0];
    if (mdlActor)
      applyModelDMP(mdlActor, labelConfig);
    
  }

  function applyGreyImageDMP(actor, imgConfig) {
    const DMPHelper = CreateDMPHelper();

    actor.getProperty().setRGBTransferFunction(0, DMPHelper.CreateImageColorFunction());
    actor.getProperty().setColorLevel(imgConfig.ColorLevel);
    actor.getProperty().setColorWindow(imgConfig.ColorWindow);
  }

  function applySegmentationDMP(actor, labelConfig) {
    const DMPHelper = CreateDMPHelper();

  }

  function applyModelDMP(actor, labelConfig) {

  }

  function updateVisibleVolume(tp, resetCamera = false, isInitial = false) {
    const volume = tpVolData.current[tp];
    console.log("[updateVisibleVolume] volume: ", volume);

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

  function updateVisibleSegmentation(tp, resetCamera = false, isInitial = false) {
    console.log("[updateVisibleSegmentation]");
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

  function updateVisibleModel(tp, resetCamera = false, isInitial = false) {
    console.log("[updateVisibleModel]");
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

  function updateVisibleDataset(tp, resetCamera = false, isInitial = false) {
    console.log("[updateVisibleDataset] tp=", tp, "; resetCamera=", resetCamera);
    if (!context.current)
      return;

    const { renderWindow } = context.current;
    updateVisibleVolume(tp, resetCamera, isInitial);
    updateVisibleModel(tp, resetCamera, isInitial);
    updateVisibleSegmentation(tp, resetCamera, isInitial);

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
    console.log("[ToggleStudyMenu]");
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