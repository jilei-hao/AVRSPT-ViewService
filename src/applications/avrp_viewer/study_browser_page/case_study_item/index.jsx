import React, { useState } from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';

function StudyItem ({ study_data, active, onStudySelected }) {
  return (
    <div className={styles.studyItem}>
      <div 
        className={`${styles.studyItem} ${active ? styles.studyItemActive : ''}`} 
        id={study_data.id}  onClick={ onStudySelected }
      >
        {study_data.study_name}
      </div>
    </div>
  )
}

export default function CaseStudyItem ({ case_data }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {studyId, setStudyId} = useAVRPGlobal();

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const onStudySelected = (e) => {
    const study_id = e.target.id;
    setStudyId(study_id);
  };

  return (
    <div className={ styles.caseStudyItem }>
      <div className={ styles.caseItem } onClick={ toggleExpansion }>
        <span>{ case_data.case_name }</span>
      </div>
      {isExpanded && (case_data.studies.length > 0) && (
        case_data.studies.map((study_data, index) => (
          <StudyItem key={index} 
            study_data={study_data}
            active={studyId == study_data.id} 
            onStudySelected={ onStudySelected }
          />
        ))
      )}
    </div>
  );
};
