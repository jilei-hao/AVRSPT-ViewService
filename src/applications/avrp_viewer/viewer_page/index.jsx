import React from 'react';
import styles from './styles.module.css';
import AVRPDataProvider from "./avrp_data_context";;
import MainControlPanel from './main_control_panel';
import AVRPViewerStateProvider, { useAVRPViewerState } from './avrp_viewer_state_context';
import View from './view';
import { SingleLabelModelLayer, CoaptationSurfaceLayer } from './layers';


function Viewer() {
  const { viewHeaders } = useAVRPViewerState();
  console.log("[Viewer] viewHeaders: ", viewHeaders);
  return (
    <div className={styles.viewerContainer}>
      { viewHeaders.map((view) => {
        return (
          <View 
            key={view.id} 
            pctTop={view.geometry.pctTop} 
            pctLeft={view.geometry.pctLeft} 
            pctWidth={view.geometry.pctWidth} 
            pctHeight={view.geometry.pctHeight}
            viewI={view.id}
          >
            { 
              view.layers.map((layer) => {
              switch(layer.type) {
                case 'model-sl':
                  return <SingleLabelModelLayer key={layer.id} name={layer.name}/>;
                case 'coaptation-surface':
                  return <CoaptationSurfaceLayer key={layer.id} name={layer.name}/>;
                default:
                  return '';
              }})
            }
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

