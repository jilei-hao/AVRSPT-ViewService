import React, { useState } from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';
import CaseStudyItem from '../case_study_item';

export default function CaseStudyContainer () {
  const { caseStudyHeaders } = useAVRPGlobal();

  console.log("[CaseStudyContainer] caseStudyHeaders: ", caseStudyHeaders)

  return (
    <aside className={ styles.container }>
      <div className={ styles.containerHeader }>
        <span>Studies</span>
      </div>
      { caseStudyHeaders ? caseStudyHeaders.map((_item, _index) => (
          <CaseStudyItem key={ _index } case_data={ _item }/>
        )) : ''}
    </aside>
  );
};
