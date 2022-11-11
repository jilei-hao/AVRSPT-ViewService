import { useState, useRef, useEffect } from 'react';

import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource      from '@kitware/vtk.js/Filters/Sources/ConeSource';

import vtkHttpDataAccessHelper from '@kitware/vtk.js//IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkPolyData from '@kitware/vtk.js//Common/DataModel/PolyData';

export default function Model() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null); // stores vtk related objects
  const tpSlider = useRef(null); // ref to the tp slider
  const [currentTP, setCurrentTP] = useState(1);
  const [representation, setRepresentation] = useState(2);
  const [devMessage, setDevMessage] = useState("");
  const [hasDataDownloaded, setHasDataDownloaded] = useState(false);
  const [tpData, setTPData] = useState([]);


  const BASE_URL = 'http://10.102.165.25:8000/bavcta008/mesh_ds/vtp';
  //const BASE_URL = 'http://192.168.50.37:8000/bavcta008/mesh_ds/vtp';
  
  const { fetchBinary } = vtkHttpDataAccessHelper;

  function downloadTimeSeries() {
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
          setDevMessage(`loading file: ${filename}`);
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
    if (context.current) {
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
      renderWindow.render();

      if (!hasDataDownloaded) {
        downloadTimeSeries().then((downloadedData) => {
          console.log("All Data Downloaded!");
          setTPData(
            downloadedData.filter((ds) => getDataTimeStep(ds) !== null)
                          .sort((a, b) => getDataTimeStep(a) - getDataTimeStep(b))
          );
          updateSlider(tpData.length);
          renderer.getActiveCamera().setPosition(0, 55, -22);
          renderer.getActiveCamera().setViewUp(0, 0, -1);
          setVisibleDataset(tpData[0]);
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
      const ds = tpData[Number(currentTP - 1)];
      setVisibleDataset(ds);
      renderWindow.render();
    }
  }, [currentTP]);

  useEffect(() => {
    if (context.current) {
      const { actor, renderWindow } = context.current;
      actor.getProperty().setRepresentation(representation);
      renderWindow.render();
    }
  }, [representation]);


  return (
    <div>
      <div ref={vtkContainerRef} />
      <table
        style={{
          position: 'absolute',
          top: '25px',
          left: '25px',
          background: 'white',
          padding: '12px',
        }}
      >
        <tbody>
          <tr>
            <td>
              <select
                value={representation}
                style={{ width: '100%' }}
                onInput={(ev) => setRepresentation(Number(ev.target.value))}
              >
                <option value="0">Points</option>
                <option value="1">Wireframe</option>
                <option value="2">Surface</option>
              </select>
            </td>
          </tr>
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
          </tr>
          <tr>
            <td>
              <p>DevMessage: </p>
              <span value={devMessage} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

