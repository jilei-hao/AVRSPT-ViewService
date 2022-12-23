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
  console.log("Render App");
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // vtk related objects
  const hasDownloadingStarted = useRef(false);
  const timeData = useRef([]);
  const tpSlider = useRef(null); // ref to the tp slider
  const [currentTP, setCurrentTP] = useState(1);
  const [replayTimer, setReplayTimer] = useState({});
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [frameTimeInMS, setFrameTimeInMS] = useState(50);

  const { fetchBinary } = vtkHttpDataAccessHelper;

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
        background: [0.1, 0.1, 0.1],
      });

      const renderWindow = fullScreenRenderWindow.getRenderWindow();
      const renderer = fullScreenRenderWindow.getRenderer();
      const interactor = renderWindow.getInteractor();
      interactor.setDesiredUpdateRate(15.0);
      
      const reader = vtkXMLImageDataReader.newInstance();
      const mapper = vtkVolumeMapper.newInstance();
      const actor = vtkVolume.newInstance();
      mapper.setInputConnection(reader.getOutputPort());
      actor.setMapper(mapper);
      renderer.addVolume(actor);

      // Configure Color and Contrast
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

      // Start Downloading Data
      if (!hasDownloadingStarted.current) {
        hasDownloadingStarted.current = true;
        downloadData().then((downloadedData) => {
          console.log("Data Downloaded: ", downloadedData);
          timeData.current = [...downloadedData];
          setVisibleDataset(timeData.current[currentTP - 1]);
          updateSlider(downloadedData.length);
        });
      }
      
      context.current = {
        fullScreenRenderWindow, renderWindow, renderer,
        actor, mapper, reader,
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

  const BASE_URL = 'http://192.168.50.37:8000'
  //const BASE_URL = 'http://10.102.180.67:8000'

  function downloadData() {
    console.log("[downloadData] started");
    const files = [
      'dist/img3d_ds_bavcta008_baseline_00.vti',
      'dist/img3d_ds_bavcta008_baseline_01.vti',
      'dist/img3d_ds_bavcta008_baseline_02.vti',
      'dist/img3d_ds_bavcta008_baseline_03.vti',
      'dist/img3d_ds_bavcta008_baseline_04.vti',
      'dist/img3d_ds_bavcta008_baseline_05.vti',
      'dist/img3d_ds_bavcta008_baseline_06.vti',
      'dist/img3d_ds_bavcta008_baseline_07.vti',
      'dist/img3d_ds_bavcta008_baseline_08.vti',
      'dist/img3d_ds_bavcta008_baseline_09.vti',
      'dist/img3d_ds_bavcta008_baseline_10.vti',
      'dist/img3d_ds_bavcta008_baseline_11.vti',
      'dist/img3d_ds_bavcta008_baseline_12.vti',
      'dist/img3d_ds_bavcta008_baseline_13.vti',
      'dist/img3d_ds_bavcta008_baseline_14.vti',
      'dist/img3d_ds_bavcta008_baseline_15.vti',
      'dist/img3d_ds_bavcta008_baseline_16.vti',
      'dist/img3d_ds_bavcta008_baseline_17.vti',
      'dist/img3d_ds_bavcta008_baseline_18.vti',
      'dist/img3d_ds_bavcta008_baseline_19.vti',

    ];
    return Promise.all(
      files.map((fn) => 
        fetchBinary(`${BASE_URL}/${fn}`).then((binary) => {
          return binary;
        })
      )
    )
  };

  function setVisibleDataset(ds) {
    if (context.current) {
      const { renderWindow, mapper, renderer, actor, reader } = context.current;
      //mapper.setInputData(ds);
      console.log("[setVisibleDataset] input data: ", ds);
      reader.parseAsArrayBuffer(ds);

      renderer.resetCamera();
      //renderer.getActiveCamera().elevation(-70);
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
      const { renderWindow } = context.current;
      console.log("Current TP Changed to: ", currentTP);
      const ds = timeData.current[Number(currentTP - 1)];
      setVisibleDataset(ds);
      renderWindow.render();
    }
  }, [currentTP]);

  function onReplayClicked() {
    setIsReplayOn(!isReplayOn);
  }

  function onPreviousClicked() {
    setCurrentTP(prevTP => (prevTP - 1) % timeData.current.length);
  }

  function onNextClicked() {
    setCurrentTP(prevTP => prevTP % timeData.current.length + 1);
  }

  useEffect(() => {
    clearInterval(replayTimer);
    if (isReplayOn) {
      setReplayTimer(setInterval(() => {
        setCurrentTP(prevTP => prevTP % timeData.current.length + 1);
      }, frameTimeInMS));
    }
  }, [frameTimeInMS, isReplayOn]);

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div className={styles.control_panel}>
      <div class={styles.replay_panel}>
          <div class={styles.tp_slider}>
            <button class={styles.tp_slider_button}
              onClick={onPreviousClicked}
            >
              <span style={{fontSize: '25px', color: 'black'}}>
                {'◄▮'}
              </span>
            </button>
            <input
              ref={tpSlider}
              class={styles.touch_slider}
              type="range"
              min="1"
              max="1"
              value={currentTP}
              onChange={(ev) => setCurrentTP(Number(ev.target.value))}
            />
            <button class={styles.tp_slider_button}
              onClick={onNextClicked}
            >
              <span style={{fontSize: '25px', color: 'black'}}>
                {'▮►'}
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
              {isReplayOn ? "▮▮" : "▶"}
            </span>
          </button>
          
        </div>
      </div>
    </div>
  );
}