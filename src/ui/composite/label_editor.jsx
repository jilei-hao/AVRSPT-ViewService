import { useContext, useState, useRef } from "react"

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
  const [opacity, setOpacity] = useState(props.initRGBA[3]);

  function _onOpacityChange (e) {
    setOpacity(e.target.value);
    props.onOpacityChange(props.label, e.target.value);
  }

  return (
    <LabelEditorRow>
      <label>{props.label}</label>
      <div>[CR]</div>
      <label>{props.desc}</label>
      <input type="range" min="0" max="1" step="0.01" 
        value={opacity} onChange={_onOpacityChange}
      />
      <input type="checkbox" />
    </LabelEditorRow>
  )
}

export default function LabelEditor (props) {
  console.log("LabelEditor: ", props);

  const labelRows = props.initialLabelConfig.map(label => 
    <LabelConfigPanel key={label.Number} 
      label={label.Number} initRGBA={label.RGBA} desc={label.Description}
      onOpacityChange={ props.onOpacityChange }/>
  );

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