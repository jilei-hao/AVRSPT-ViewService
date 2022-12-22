import { useState, useRef, useEffect } from 'react';

import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkLookupTable from '@kitware/vtk.js/Common/Core/LookupTable';
import vtkScalarBarActor from '@kitware/vtk.js/Rendering/Core/ScalarBarActor'

import styles from '../../app.module.css'

export default function Model() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // stores vtk related objects
  const tpSlider = useRef(null); // ref to the tp slider
  const [currentTP, setCurrentTP] = useState(1);
  const [hasDataDownloaded, setHasDataDownloaded] = useState(false);
  const [timeData, setTimeData] = useState([]);
  const [replayTimer, setReplayTimer] = useState({});
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [frameTimeInMS, setFrameTimeInMS] = useState(50);

  const BASE_URL = 'http://10.102.180.67:8000/bavcta008/vtp/decimated';
  //const BASE_URL = 'http://192.168.50.37:8000/bavcta008/mesh_ds/vtp';
  
  const { fetchBinary } = vtkHttpDataAccessHelper;

  function downloadData() {
    console.log("[downloadData] started");
    const files = [
      'seg3d_bavcta008_ds_00_dec.vtp',
      'seg3d_bavcta008_ds_01_dec.vtp',
      'seg3d_bavcta008_ds_02_dec.vtp',
      'seg3d_bavcta008_ds_03_dec.vtp',
      'seg3d_bavcta008_ds_04_dec.vtp',
      'seg3d_bavcta008_ds_05_dec.vtp',
      'seg3d_bavcta008_ds_06_dec.vtp',
      'seg3d_bavcta008_ds_07_dec.vtp',
      'seg3d_bavcta008_ds_08_dec.vtp',
      'seg3d_bavcta008_ds_09_dec.vtp',
      'seg3d_bavcta008_ds_10_dec.vtp',
      'seg3d_bavcta008_ds_11_dec.vtp',
      'seg3d_bavcta008_ds_12_dec.vtp',
      'seg3d_bavcta008_ds_13_dec.vtp',
      'seg3d_bavcta008_ds_14_dec.vtp',
      'seg3d_bavcta008_ds_15_dec.vtp',
      'seg3d_bavcta008_ds_16_dec.vtp',
      'seg3d_bavcta008_ds_17_dec.vtp',
      'seg3d_bavcta008_ds_18_dec.vtp',
      'seg3d_bavcta008_ds_19_dec.vtp'
    ];
    return Promise.all(
      files.map((filename) => 
        fetchBinary(`${BASE_URL}/${filename}`).then((binary) => {
          const reader = vtkXMLPolyDataReader.newInstance();
          reader.parseAsArrayBuffer(binary);
          return reader.getOutputData(0);
        })
      )
    );
  }

  function getDataTimeStep(vtkObj) {
    const arr = vtkObj.getFieldData().getArrayByName('TimeValue');
    if (arr) {
      return arr.getData()[0];
    }
    return null;
  }

  function setVisibleDataset(ds) {
    if (context.current && timeData.length > 0) {
      const { renderWindow, mapper, renderer } = context.current;
      mapper.setInputData(ds);
      renderer.resetCamera();
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

  /* Initialize renderWindow, renderer, mapper and actor */
  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        rootContainer: vtkContainerRef.current, // html element containing this window
      });

      const mapper = vtkMapper.newInstance();
      mapper.setInputData(vtkPolyData.newInstance());
      mapper.setColorModeToMapScalars();
      mapper.setScalarModeToUsePointData();
      mapper.setScalarRange(2.9, 3.1);

      const lut = vtkLookupTable.newInstance();
      lut.setNumberOfColors(2);
      lut.setAboveRangeColor([1,0.87,0.74,1]);
      lut.setBelowRangeColor([1,1,1,1]);
      lut.setNanColor([1,0.87,0.74,1])
      lut.setUseAboveRangeColor(true);
      lut.setUseBelowRangeColor(true);
      lut.build();
      mapper.setLookupTable(lut);

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();
      renderer.setBackground(0, 0, 0);
      renderer.addActor(actor);
      renderer.resetCamera();

      if (!hasDataDownloaded) {
        downloadData().then((downloadedData) => {
          console.log("All Data Downloaded!");
          const sorted = downloadedData
            .filter((ds) => getDataTimeStep(ds) !== null)
            .sort((a, b) => getDataTimeStep(a) - getDataTimeStep(b));
          setTimeData([...sorted]);
          updateSlider(sorted.length);
          setVisibleDataset(timeData[0]);
          setHasDataDownloaded(true);
        });
      }

      context.current = {
        fullScreenRenderer,
        renderWindow,
        renderer,
        actor,
        mapper,
      };

      window.vtkContext = context;
    }

    return () => {
      if (context.current) {
        const { fullScreenRenderer, actor, mapper } = context.current;
        actor.delete();
        mapper.delete();
        fullScreenRenderer.delete();
        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  useEffect(() => {
    if (context.current) {
      const { renderWindow } = context.current;
      console.log("Current TP Changed to: ", currentTP);
      const ds = timeData[Number(currentTP - 1)];
      setVisibleDataset(ds);
      renderWindow.render();
    }
  }, [currentTP]);

  useEffect(() => {
    if (timeData.length > 0 && context.current) {
      const { renderWindow } = context.current;
      const ds = timeData[Number(currentTP - 1)];
      setVisibleDataset(ds);
      renderWindow.render();
    }
  }, [timeData]);

  function onReplayClicked() {
    setIsReplayOn(!isReplayOn);
  }

  function onPreviousClicked() {
    setCurrentTP(prevTP => (prevTP - 1) % timeData.length);
  }

  function onNextClicked() {
    setCurrentTP(prevTP => prevTP % timeData.length + 1);
  }

  useEffect(() => {
    clearInterval(replayTimer);
    if (isReplayOn) {
      setReplayTimer(setInterval(() => {
        setCurrentTP(prevTP => prevTP % timeData.length + 1);
      }, frameTimeInMS));
    }
  }, [frameTimeInMS, isReplayOn]);

  return (
    <div>
      <div ref={vtkContainerRef} />
      <div class={styles.control_panel}>
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

