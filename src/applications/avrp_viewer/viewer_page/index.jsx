import React from 'react';
import AVRPDataProvider from "./avrp_data_context";;
import MainControlPanel from './main_control_panel';
import AVRPViewerStateProvider, { useAVRPViewerState } from './avrp_viewer_state_context';
import View from './view';
import { SingleLabelModelLayer, CoaptationSurfaceLayer } from './layers';


function Viewer() {
  const { viewHeaders } = useAVRPViewerState();
  return (
    <div style={{position: 'absolute', width: '100vw', height: '90vh', top: '0', left: '0', backgroundColor: 'purple'}}>
      { viewHeaders.map((view) => {
        return (
          <View 
            key={view.id} 
            pctTop={view.geometry.pctTop} 
            pctLeft={view.geometry.pctLeft} 
            pctWidth={view.geometry.pctWidth} 
            pctHeight={view.geometry.pctHeight}
          >
            { view.layers.map((layer) => {
              {/* switch(layer) {
                case 'model-sl':
                  return <SingleLabelModelLayer key={layer.id} name={layer.name}/>;
                case 'coaptation-surface':
                  return <CoaptationSurfaceLayer key={layer.id} name={layer.name}/>;
                default:
                  return '';
              } */}
            })}
          </View>
        );
      })}
    </div>
  );
}

export default function ViewerPage() {
  return (
    <AVRPViewerStateProvider>
      <AVRPDataProvider>
        <Viewer/>
        <MainControlPanel/>
      </AVRPDataProvider>
    </AVRPViewerStateProvider>
    
  )
}