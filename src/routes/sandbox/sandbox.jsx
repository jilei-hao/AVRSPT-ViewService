import React from 'react';

import {
  View,
  VolumeRepresentation,
  VolumeController,
  Reader,
} from 'react-vtk-js';

function Example(props) {
  const array = [];
  while (array.length < 1000) {
    array.push(Math.random());
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <View id='0'>
        <VolumeRepresentation>
          <VolumeController />
          <Reader
            vtkClass='vtkXMLImageDataReader'
            url='http://10.102.180.67:8000/dist/img3d_bavcta008_baseline_00.vti'
          />
        </VolumeRepresentation>
      </View>
    </div>
  );
}

export default Example;