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

const BASE_URL = 'http://127.0.0.1:8000/bavcta008/';

function downloadTimeSeries() {
  const files = [
    'mesh_bavcta008_01.vtk',
    'mesh_bavcta008_02.vtk',
    'mesh_bavcta008_03.vtk',
    'mesh_bavcta008_04.vtk',
    'mesh_bavcta008_05.vtk',
    'mesh_bavcta008_06.vtk',
    'mesh_bavcta008_07.vtk',
    'mesh_bavcta008_08.vtk',
    'mesh_bavcta008_09.vtk',
    'mesh_bavcta008_10.vtk',
    'mesh_bavcta008_11.vtk',
    'mesh_bavcta008_12.vtk',
    'mesh_bavcta008_13.vtk',
    'mesh_bavcta008_14.vtk',
    'mesh_bavcta008_15.vtk',
    'mesh_bavcta008_16.vtk',
    'mesh_bavcta008_17.vtk',
    'mesh_bavcta008_18.vtk',
    'mesh_bavcta008_19.vtk',
    'mesh_bavcta008_20.vtk'
  ];
  return Promise.all(
    files.map((filename) =>
      fetchBinary(`${BASE_URL}/${filename}`).then((binary) => {
        const reader = vtkPolyDataReader.newInstance();
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