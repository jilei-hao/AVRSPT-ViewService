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
  const RGBA = [...props.initRGBA];
  const [opacity, setOpacity] = useState(RGBA[3]);

  function _onOpacityChange (e) {
    setOpacity(e.target.value);
    props.onOpacityChange(props.label, e.target.value);
  }

  const styleColorBlock = {
    width: "30px",
    height: "30px",
    marginLeft: "7px",
    marginRight: "5px",
    borderRadius: "3px",
    backgroundColor: `rgb(${RGBA[0]*255}, ${RGBA[1]*255}, ${RGBA[2]*255})`,
  }

  return (
    <LabelEditorRow>
      <div style={styleColorBlock} />
      <div className={styles.label_desc_box}>{props.desc}</div>
      <input type="range" min="0" max="1" step="0.01" 
        value={opacity} onChange={_onOpacityChange}
      />
      <input type="checkbox" />
    </LabelEditorRow>
  )
}

export default function LabelEditor (props) {
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
        <select className={styles.label_preset_select}>
          <option value="0">Solid Color</option>
          <option value="1">Simple</option>
          <option value="2">Cusp</option>
        </select>
      </LabelEditorRow>
      { labelRows }
    </div>
  );
}