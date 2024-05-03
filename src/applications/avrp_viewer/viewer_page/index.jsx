import React from 'react';
import AVRPDataProvider from "./avrp_data_context";
import AVRPApplicationProvider from './avrp_application_context';
import MainControlPanel from './main_control_panel';
import AVRPRenderingProvider from './avrp_rendering_context';

export default function ViewerPage() {
  return (
    <AVRPDataProvider>
      <AVRPRenderingProvider>
        <AVRPApplicationProvider>
          <MainControlPanel />
        </AVRPApplicationProvider>
      </AVRPRenderingProvider>
    </AVRPDataProvider>
  )
}