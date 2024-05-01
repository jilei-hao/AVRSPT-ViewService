import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';
import { AVRPGatewayHelper } from '../../api_helpers';

export default function StudyPreviewPanel () {
  const { caseStudyHeaders, studyId } = useAVRPGlobal();

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

  useEffect(() => {
    console.log("[StudyPreviewPanel] studyId: ", studyId);

    if (studyId) {
      const gwHelper = AVRPGatewayHelper.getInstance();
      gwHelper.getStudyDataHeader(studyId).then((data) => {
        console.log("[StudyPreviewPanel] getStudyDataHeader: ", data);
      });
    }
  }, [studyId]);
  

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
              <span>Status: {selectedStudy.status_name}</span>
              <button className={ styles.buttonOpen }>Load</button>
            </div>
          </>
        ) : ''
      }
      
    </div>
  );
};