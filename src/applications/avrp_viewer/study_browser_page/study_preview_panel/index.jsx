import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';
import { AVRPGatewayHelper } from '../../api_helpers';
import AVRPCommonHelper from '../../avrp_common_helper';

export default function StudyPreviewPanel () {
  const { caseStudyHeaders, studyId, studyDataHeader,
    setStudyBrowserActive
  } = useAVRPGlobal();

  console.log("[StudyPreviewPanel] studyId: ", studyId);

  let selectedStudy = null;

  if (caseStudyHeaders.length !== 0) {
    for (let case_data of caseStudyHeaders) {
      const find = case_data.studies.find(study => study.id == studyId);
      if (find) {
        selectedStudy = find;
        break;
      }
    }
  }

  const onViewerLoad = () => {
    console.log("[StudyPreviewPanel] onLoadClicked");
    if (studyId) {
      setStudyBrowserActive(false);
    }
  }
  

  console.log("[StudyPreviewPanel] selectedStudy: ", selectedStudy);

  return (
    <div className={styles.panelContainer}>
      {
      selectedStudy ? (
        <>
          <div className={ styles.panelHeader }>
            <span>{selectedStudy.study_name}</span>
          </div>
          <div className={ styles.panelBody }>
            <div className={ styles.statusBox }>
              <span>Status: {selectedStudy.status_name}</span>
            </div>
            <div className={ styles.viewerBox }>
              <iframe src={`${AVRPCommonHelper.getHostingURL()}/model-view/7`}
                title="model preview" style={{ width: '100%', height: '100%' }}></iframe>
            </div>
            <button className={ styles.buttonOpen } onClick={ onViewerLoad }>
              Load
            </button>
          </div>
        </>
      ) : ''
      }
    </div>
  );
};