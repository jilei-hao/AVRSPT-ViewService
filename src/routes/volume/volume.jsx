import { useState, useRef, useEffect } from 'react';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
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

import styles from '../../app.module.css'

export default function Volume() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const hasDownloadingStarted = useRef(false);
  const timeData = useRef([]);
  const tpSlider = useRef(null); // ref to the tp slider
  const [currentTP, setCurrentTP] = useState(1); // 0-based index (display index is 1-based)
  const [replayTimer, setReplayTimer] = useState({});
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [frameTimeInMS, setFrameTimeInMS] = useState(50);
  const [nT, setNT] = useState(20);
  const [IPSMin, setIPSMin] = useState(0);
  const [IPSMax, setIPSMax] = useState(1);
  const [blendMode, setBlendMode] = useState(0); // Composite
  
  const { fetchBinary } = vtkHttpDataAccessHelper;

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        // background: [0.003, 0.086, 0.153],
        background: [0, 0, 0],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const renderer = fullScreenRenderWindow.getRenderer();
      const interactor = renderWindow.getInteractor();
      interactor.setDesiredUpdateRate(15.0);

      const tpActors = [];
      
      for (let i = 0; i < nT; i++) {
        const reader = vtkXMLImageDataReader.newInstance();
        const mapper = vtkVolumeMapper.newInstance();
        const actor = vtkVolume.newInstance();

        mapper.setInputConnection(reader.getOutputPort());
        actor.setMapper(mapper);
        initMapperConfig(mapper);
        initActorConfig(actor);
        renderer.addVolume(actor);

        tpActors.push({ reader, mapper, actor });
      }

      context.current = {
        fullScreenRenderWindow, renderWindow, renderer, tpActors
      };
      
      // Start Downloading Data
      if (!hasDownloadingStarted.current) {
        hasDownloadingStarted.current = true;
        downloadData().then((downloadedData) => {
          console.log("Data Downloaded: ", downloadedData);
          timeData.current = [...downloadedData];
          for (let i = 0; i < timeData.current.length; i++) {
            connectDataWithActor(i).then(tp => {
              if (tp === currentTP)
                updateVisibleDataset(true);
            });
          }
          updateSlider(downloadedData.length);
        });
      }
      
      window.vtkContext = context.current; // for browser debugging
    }

    return () => {
      if (context.current) {
        const { fullScreenRenderWindow, tpActors } = context.current;
        tpActors.forEach(element => {
          const { reader, actor, mapper } = element;
          reader.delete();
          actor.delete();
          mapper.delete();
        });
        fullScreenRenderWindow.delete();
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

  function initMapperConfig(mapper) {
    // Configure Color and Contrast
    mapper.setSampleDistance(3);
    mapper.setPreferSizeOverAccuracy(true);
    mapper.setBlendModeToComposite();
    mapper.setIpScalarRange(IPSMin, IPSMax);
  }

  function initActorConfig(actor) {
    updatePiecewiseFunction(actor);
    actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
    actor.getProperty().setInterpolationTypeToNearest();
    //actor.getProperty().setInterpolationTypeToLinear();
    actor.getProperty().setShade(true);
    actor.getProperty().setAmbient(0.1);
    actor.getProperty().setDiffuse(0.9);
    actor.getProperty().setSpecular(0.2);
    actor.getProperty().setSpecularPower(10.0);
  }

  // const BASE_URL = 'http://192.168.50.37:8000'
  const BASE_URL = 'http://10.102.180.67:8000'

  function downloadData() {
    console.log("[downloadData] started");
    const files = [
      'dist/volume/ds/cropped/img_slice_cropped_rs_00.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_01.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_02.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_03.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_04.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_05.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_06.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_07.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_08.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_09.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_10.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_11.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_12.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_13.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_14.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_15.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_16.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_17.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_18.vti',
      'dist/volume/ds/cropped/img_slice_cropped_rs_19.vti',
    ];
    return Promise.all(
      files.map((fn) => 
        fetchBinary(`${BASE_URL}/${fn}`).then((binary) => {
          return binary;
        })
      )
    )
  };

  function updateVisibleDataset(resetCamera = false) {
    if (context.current && timeData.current.length > 0) {
      const { renderWindow, renderer, tpActors } = context.current;
      tpActors.forEach((e, i) => 
        e.actor.setVisibility(i == currentTP)
      );

      if (resetCamera) {
        renderer.resetCamera();
        renderer.getActiveCamera().elevation(-70);
      }
      
      renderWindow.render();
    }
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
    const l = timeData.current.length;
    setCurrentTP(prevTP => l - 1 - (l - prevTP) % l);
  }

  function onNextClicked() {
    setCurrentTP(prevTP => (prevTP + 1) % timeData.current.length);
  }

  useEffect(() => {
    clearInterval(replayTimer);
    if (isReplayOn) {
      setReplayTimer(setInterval(onNextClicked, frameTimeInMS));
    }
  }, [frameTimeInMS, isReplayOn]);

  function updateBlendMode(mode) {
    if (context.current) {
      context.current.tpActors.forEach((e) => {
        const { actor, mapper } = e;
        mapper.setBlendMode(mode);
        mapper.setIpScalarRange(IPSMin, IPSMax);
        updatePiecewiseFunction(actor);
      });
    }
  }

  function updatePiecewiseFunction(actor) {
    const colorTransferFunction = vtkColorTransferFunction.newInstance();
    colorTransferFunction.addRGBPoint(-1024, 0, 0, 0);
    colorTransferFunction.addRGBPoint(-300, 0, 0, 0);
    colorTransferFunction.addRGBPoint(461, 1, 1, 1);
    colorTransferFunction.addRGBPoint(1925, 1, 1, 1);

    actor.getProperty().setRGBTransferFunction(0, colorTransferFunction);

    const opacityFunction = vtkPiecewiseFunction.newInstance();
    opacityFunction.addPoint(-1024, 0.0);
    opacityFunction.addPoint(-300, 0.1);
    opacityFunction.addPoint(461, 0.9);
    opacityFunction.addPoint(1925, 1.0);

    actor.getProperty().setScalarOpacity(0, opacityFunction);
  }

  useEffect(() => {
    if (context.current) {
      updateBlendMode(blendMode);
      updateVisibleDataset();
    }
  }, [blendMode])

  useEffect(() => {
    if (context.current && blendMode == 3) {
      context.current.tpActors.forEach((e) => {
        const { actor, mapper } = e;
        mapper.setIpScalarRange(IPSMin, IPSMax);
        updatePiecewiseFunction(actor);
      })
      updateVisibleDataset();
    }
  }, [IPSMin, IPSMax])

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div className={styles.control_panel}>
        <div className={styles.replay_panel}>
          <div className={styles.tp_slider}>
            <button className={styles.tp_slider_button}
              onClick={onPreviousClicked}
            >
              <span style={{fontSize: '25px', color: 'black'}}>
                {'??????'}
              </span>
            </button>
            <input
              ref={tpSlider}
              className={styles.touch_slider}
              type="range"
              min="1"
              max="1"
              value={currentTP + 1}
              onChange={(ev) => setCurrentTP(Number(ev.target.value - 1))}
            />
            <button className={styles.tp_slider_button}
              onClick={onNextClicked}
            >
              <span style={{fontSize: '25px', color: 'black'}}>
                {'??????'}
              </span>
            </button>
          </div>
          <button 
            onClick={onReplayClicked}
            style={{
              width: '10vw',
              height: '10vh',
              verticalAlign: 'middle',
            }}
          >
            <span style={{fontSize: '60px', color: 'black'}}>
              {isReplayOn ? "??????" : "???"}
            </span>
          </button>
        </div>
      </div>
      <div className={styles.blending_panel}>
        <div className={styles.panel_item_vertical}>
          <span>Blend&nbsp;Mode</span>
          <select className={styles.touch_select} 
            value={blendMode}
            onChange={(ev)=>setBlendMode(ev.target.value)}
          >
            <option value="0">Composite</option>
            <option value="1">Maximum Intensity</option>
            <option value="2">Minimum Intensity</option>
            <option value="3">Average Intensity</option>
          </select>
        </div>
        <div id="ips-min" className={styles.panel_item_vertical}
          style={{visibility: blendMode==3 ? 'visible' : 'hidden'}}
        >
          <span>IP&nbsp;Scalar&nbsp;Min</span>
          <input className={styles.touch_slider}
            type="range" min="0" max="1" step="0.01" value={IPSMin}
            onChange={(ev)=>setIPSMin(ev.target.value)}
          />
        </div>
        <div id="ips-max" className={styles.panel_item_vertical}
          style={{visibility: blendMode==3 ? 'visible' : 'hidden'}}
        >
          <span>IP&nbsp;Scalar&nbsp;Max</span>
          <input className={styles.touch_slider}
            type="range" min="0" max="1" step="0.01" value={IPSMax}
            onChange={(ev)=>setIPSMax(ev.target.value)}
          />
        </div>
      </div>
    </div>
  );
}