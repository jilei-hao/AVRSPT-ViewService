import React from 'react';
import AVRPDataProvider from "./avrp_data_context";
import AVRPApplicationProvider from './avrp_application_context';
import MainControlPanel from './main_control_panel';
import AVRPRenderingProvider from './avrp_rendering_context';
import AVRPViewerStateProvider from './avrp_viewer_state_context';

export default function ViewerPage() {
  return (
    <AVRPViewerStateProvider>
      <AVRPDataProvider>
        <AVRPRenderingProvider>
          <AVRPApplicationProvider>
            <MainControlPanel />
          </AVRPApplicationProvider>
        </AVRPRenderingProvider>
      </AVRPDataProvider>
    </AVRPViewerStateProvider>
    
  )
}