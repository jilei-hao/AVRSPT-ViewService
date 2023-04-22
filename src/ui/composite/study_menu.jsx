import { useState, useRef } from "react"

import styles from "./ui_composite.module.css"

function StudyMenuRow (props) {
  function onElementClick() {
    props.onClick(props.studyKey);
  }

  return (
    <div className={styles.study_menu_row} onClick={ onElementClick }>
      {props.children}
    </div>
  );
}

export default function StudyMenu (props) {
  //console.log("[StudyMenu]: ", props);

  if (!props.initStudyConfig)
    return;

  const { initStudyConfig, onStudyChange } = props;

  const studyRow = [];
  initStudyConfig.forEach((e) => {
    studyRow.push(
      <StudyMenuRow key={e.key} studyKey={e.key} onClick={props.onStudyChange}>
        <div className={styles.study_desc_box}>{e.key}</div>
      </StudyMenuRow>
    )
  });

  return (
    <div className={
        `${styles.study_menu} 
        ${props.visible ? styles.study_menu__active: styles.study_menu__inactive}
        ${props.visible ? styles.visible : styles.hidden}`
      }
    >
      <div className={styles.study_menu_row_box}>
        { studyRow }
      </div>
    </div>
  );
}