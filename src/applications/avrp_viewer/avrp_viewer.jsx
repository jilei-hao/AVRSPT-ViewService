import React from 'react';
import AVRPAuthProvider from './avrp_auth_context';
import PageContainer from './page_container';

export default function AVRPViewer({ studyId }) {
  return (
    <AVRPAuthProvider>
      <PageContainer />
    </AVRPAuthProvider>
  )
}