import { useContext, useState} from "react"

import styles from "./ui_composite.module.css"
import { RenderContext } from "../../model/context";

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
      <label>LN</label>
      <div>Color</div>
      <label>Description</label>
      <input type="range" />
      <input type="checkbox" />
    </LabelEditorRow>
  )
}

export default function LabelEditor (props) {
  const renContext = useContext(RenderContext);
  const [labelConfig, setLabelConfig] = useState([]);

  if (renContext) {
    const { currentCase } = renContext;
    console.log("LabelconfigPanel", currentCase);
  }
  

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
      <LabelConfigPanel />
      <LabelConfigPanel />
      <LabelConfigPanel />
      <LabelConfigPanel />

    </div>
  );
}