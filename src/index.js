import '@kitware/vtk.js//favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js//Rendering/Profiles/Geometry';

import vtkActor from '@kitware/vtk.js//Rendering/Core/Actor';
import vtkPolyData from '@kitware/vtk.js//Common/DataModel/PolyData';
import vtkFullScreenRenderWindow from '@kitware/vtk.js//Rendering/Misc/FullScreenRenderWindow';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkPolyDataReader from '@kitware/vtk.js/IO/Legacy/PolyDataReader';
import vtkMapper from '@kitware/vtk.js//Rendering/Core/Mapper';
import vtkHttpDataAccessHelper from '@kitware/vtk.js//IO/Core/DataAccessHelper/HttpDataAccessHelper';

import controlPanel from './controller.html';

const { fetchBinary, fetchText } = vtkHttpDataAccessHelper;

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

const mapper = vtkMapper.newInstance();
mapper.setInputData(vtkPolyData.newInstance());

const actor = vtkActor.newInstance();
actor.setMapper(mapper);

renderer.addActor(actor);
renderer.resetCamera();
renderWindow.render();

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------
// Download a series of VTP files in a time series, sort them by time, and
// then display them in a playback series.
// ----------------------------------------------------------------------------

const BASE_URL = 'http://10.102.165.25:8000/bavcta008/mesh_ds/vtp';

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
        uiUpdateMessage(`loading file: ${filename}`);
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
  mapper.setInputData(ds);
  renderer.resetCamera();
  renderWindow.render();
}

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

function uiUpdateMessage(msg) {
  document.querySelector('#msg').innerText = msg;
}

function uiUpdateSlider(max) {
  const timeslider = document.querySelector('#timeslider');
  timeslider.min = 0;
  timeslider.max = max - 1;
  timeslider.step = 1;
}

fullScreenRenderer.addController(controlPanel);

// -----------------------------------------------------------
// example code logic
// -----------------------------------------------------------

let timeSeriesData = [];

const timeslider = document.querySelector('#timeslider');
const timevalue = document.querySelector('#timevalue');

timeslider.addEventListener('input', (e) => {
  const activeDataset = timeSeriesData[Number(e.target.value)];
  if (activeDataset) {
    setVisibleDataset(activeDataset);
    timevalue.innerText = getDataTimeStep(activeDataset);
  }
});

downloadTimeSeries().then((downloadedData) => {
  uiUpdateMessage("All data downloaded");
  timeSeriesData = downloadedData.filter((ds) => getDataTimeStep(ds) !== null);
  timeSeriesData.sort((a, b) => getDataTimeStep(a) - getDataTimeStep(b));

  uiUpdateSlider(timeSeriesData.length);
  timeslider.value = 0;

  // set up camera
  renderer.getActiveCamera().setPosition(0, 55, -22);
  renderer.getActiveCamera().setViewUp(0, 0, -1);

  setVisibleDataset(timeSeriesData[0]);
  timevalue.innerText = getDataTimeStep(timeSeriesData[0]);
});

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.mapper = mapper;
global.actor = actor;
global.renderer = renderer;
global.renderWindow = renderWindow;