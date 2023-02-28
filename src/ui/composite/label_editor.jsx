import { Fragment, useContext, useState} from "react"

import styles from "./ui_composite.module.css"
import { RenderContext } from "../../model/context";
import { CreateDisplayMappingPolicy } from "../../model";

function LabelEditorRow (props) {
  return (
    <div className={styles.label_editor_row}>
      {props.children}
    </div>
  );
}

function LabelConfigPanel (props) {
  return (
    <LabelEditorRow>
      <label>[LN]</label>
      <div>[CR]</div>
      <label>[Desc]</label>
      <input type="range" min="0" max="1" step="0.01" 
        onChange={(e) => props.onOpacityChange(0, e.target.value)}
      />
      <input type="checkbox" />
    </LabelEditorRow>
  )
}

export default function LabelEditor (props) {
  console.log("LabelEditor: labelConfig: ", props.labelConfig);

  const labelRows = props.labelConfig.map(label => 
    <LabelConfigPanel key={label.Number} 
      onOpacityChange={ props.onOpacityChange }
    />
  ) 

  return (
    <div className={
        `${styles.label_editor} 
        ${props.visible ? styles.label_editor__active: styles.label_editor__inactive}
        ${props.visible ? styles.visible : styles.hidden}`
      }
    >
      <LabelEditorRow>
        <select>
          <option value="0">Solid Color</option>
          <option value="1">Simple</option>
          <option value="2">Cusp</option>
        </select>
      </LabelEditorRow>
      { labelRows }
    </div>
  );
}