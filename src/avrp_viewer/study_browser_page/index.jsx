import React from "react"
import styles from './styles.module.css'
import CaseStudyContainer from  './case_study_container'
import StudyPreviewPanel from "./study_preview_panel"

export default function StudyBrowserPage() {
  return (
    <div className={styles.studyBrowsercontainer}>
      <CaseStudyContainer />
      <StudyPreviewPanel />
    </div>
  )
}