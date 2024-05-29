import React from 'react';
import AVRPAuthProvider from './avrp_auth_context';
import AVRPGlobalProvider from './avrp_global_context';
import AVRPDataProvider from './viewer_page/avrp_data_context';
import PageContainer from './page_container';

export default function AVRPViewer({ studyId }) {
  return (
    <AVRPAuthProvider>
      <AVRPGlobalProvider>
        <PageContainer />
      </AVRPGlobalProvider>
    </AVRPAuthProvider>
  )
}