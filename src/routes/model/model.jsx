import { useState, useRef, useEffect } from 'react';

import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkHttpDataAccessHelper from '@kitware/vtk.js//IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkPolyData from '@kitware/vtk.js//Common/DataModel/PolyData';

export default function Model() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // stores vtk related objects
  const tpSlider = useRef(null); // ref to the tp slider
  const [currentTP, setCurrentTP] = useState(1);
  const [hasDataDownloaded, setHasDataDownloaded] = useState(false);
  const [timeData, setTimeData] = useState([]);
  const [replayTimer, setReplayTimer] = useState({});
  const [isReplayOn, setIsReplayOn] = useState(false);

  const BASE_URL = 'http://10.102.165.25:8000/bavcta008/mesh_ds/vtp';
  //const BASE_URL = 'http://192.168.50.37:8000/bavcta008/mesh_ds/vtp';
  
  const { fetchBinary } = vtkHttpDataAccessHelper;

  function downloadData() {
    console.log("[doanloadData] downloading started");
    const files = [
      'seg3d_bavcta008_ds_00.nii.vtp',
      'seg3d_bavcta008_ds_01.nii.vtp',
      'seg3d_bavcta008_ds_02.nii.vtp',
      'seg3d_bavcta008_ds_03.nii.vtp',
      'seg3d_bavcta008_ds_04.nii.vtp',
      'seg3d_bavcta008_ds_05.nii.vtp',
      'seg3d_bavcta008_ds_06.nii.vtp',
      'seg3d_bavcta008_ds_07.nii.vtp',
      'seg3d_bavcta008_ds_08.nii.vtp',
      'seg3d_bavcta008_ds_09.nii.vtp',
      'seg3d_bavcta008_ds_10.nii.vtp',
      'seg3d_bavcta008_ds_11.nii.vtp',
      'seg3d_bavcta008_ds_12.nii.vtp',
      'seg3d_bavcta008_ds_13.nii.vtp',
      'seg3d_bavcta008_ds_14.nii.vtp',
      'seg3d_bavcta008_ds_15.nii.vtp',
      'seg3d_bavcta008_ds_16.nii.vtp',
      'seg3d_bavcta008_ds_17.nii.vtp',
      'seg3d_bavcta008_ds_18.nii.vtp',
      'seg3d_bavcta008_ds_19.nii.vtp'
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
      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();
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
          renderer.getActiveCamera().setPosition(0, 55, -22);
          renderer.getActiveCamera().setViewUp(0, 0, -1);
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
    }

    return () => {
      if (context.current) {
        console.log("[(Effect)vtkContainerRef: Cleaning up");
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

  function changeToNextTP() {
    const nt = timeData.length;
    if (nt > 0) {
      console.log("[changeToNextTP] currentTP=", currentTP);
      setCurrentTP(prevTP => prevTP % nt + 1);
    }
  }

  useEffect(() => {
    if (isReplayOn) {
      setReplayTimer(setInterval(() => {
        console.log("interval tick");
        changeToNextTP();
      }, 50));
    } else {
      clearInterval(replayTimer);
    }
  }, [isReplayOn]);

  return (
    <div>
      <div ref={vtkContainerRef} />
      <table
        style={{
          position: 'absolute',
          top: '85vh',
          left: '35vw',
          width: '30vw',
          background: 'white',
          padding: '12px',
        }}
      >
        <tbody>
          <tr>
            <td>
              <input
                ref={tpSlider}
                type="range"
                min="1"
                max="1"
                value={currentTP}
                onChange={(ev) => setCurrentTP(Number(ev.target.value))}
              />
            </td>
            <td>
              <button onClick={onReplayClicked}>
                {isReplayOn ? "Pause" : "Play"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

