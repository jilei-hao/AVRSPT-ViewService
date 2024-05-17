import React from 'react';
import styles from './styles.module.css';
import AVRPDataProvider from "./avrp_data_context";;
import MainControlPanel from './main_control_panel';
import AVRPViewerStateProvider, { useAVRPViewerState } from './avrp_viewer_state_context';
import View from './view';


function Viewer() {
  const { viewHeaders } = useAVRPViewerState();
  return (
    <div className={styles.viewerContainer}>
      { viewHeaders.map((view) => {
        return (
          <View key={view.id} viewHeader={view} />
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

