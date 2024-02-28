import React from 'react';
import AVRPDataProvider from "./avrp_data_context";
import MainPage from "./main_page";

export default function AVRPViewer({ studyId }) {
  return (
    <React.StrictMode>
      <AVRPDataProvider studyId={studyId}>
        <MainPage />
      </AVRPDataProvider>
    </React.StrictMode>
  )
}