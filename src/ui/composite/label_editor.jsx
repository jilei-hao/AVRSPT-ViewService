import { useState, useEffect } from "react"

import styles from "./ui_composite.module.css"
import { CreateDMPHelper } from '../../model';

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

  // Configure parent render scene and local state at same time
  function onOpacityChangeLocal (e) {
    setOpacity(e.target.value);
    props.onOpacityChange(props.label, e.target.value);
  }

  const styleColorBlock = {
    width: "30px",
    height: "30px",
    marginLeft: "7px",
    marginRight: "5px",
    borderRadius: "3px",
    backgroundColor: `rgb(${localRGBA[0]*255}, ${localRGBA[1]*255}, ${localRGBA[2]*255})`,
  }

  return (
    <LabelEditorRow>
      <div style={styleColorBlock} />
      <div className={styles.label_desc_box}>{props.desc}</div>
      <input className={styles.touch_slider}
        type="range" min="0" max="1" step="0.01" 
        value={localRGBA[3]} onChange={onOpacityChangeLocal}
      />
    </LabelEditorRow>
  )
}

export default function LabelEditor (props) {
  if (!props.initLabelConfig)
    return;

  const { initLabelConfig, onOpacityChange, onColorChange } = props;
  const { LabelDescription, ColorPresets, DefaultColorPresetName } = initLabelConfig
  const defaultPreset = ColorPresets[DefaultColorPresetName]

  const DMPHelper = CreateDMPHelper();
  const initLabelRGBA = DMPHelper.CreateLabelRGBAMap(defaultPreset, LabelDescription);
  const [labelRGBA, setLabelRGBA] = useState(initLabelRGBA)

  function onOpacityChangeLocal (label, value) {
    let rgba = labelRGBA;
    rgba[label][3] = value;
    setLabelRGBA(rgba);
    onOpacityChange(rgba);
  }

  function onSelectedColorPresetChange (e) {
    const selectedPresetName = e.target.value;
    const selectedPreset = ColorPresets[selectedPresetName];
    
    const rgba = DMPHelper.CreateLabelRGBAMap(selectedPreset, LabelDescription);
    setLabelRGBA(rgba); // Trigger UI change
    onColorChange(rgba);
    onOpacityChange(rgba);
  }

  // Build Preset Options
  const presetOptions = []; 
  for (const k in ColorPresets) {
    presetOptions.push(
    <option key={k} value={k}>
      {k}
    </option>);
  }

  // Build Label Rows
  const labelRows = [];
  for (const k in LabelDescription) {
    const desc = LabelDescription[k];
    const rgba = labelRGBA.get(k);
    labelRows.push(
      <LabelConfigPanel key={k} label={k} rgba={rgba} desc={desc}
      onOpacityChange={ onOpacityChangeLocal }/>
    )
  }

  return (
    <div className={
        `${styles.label_editor} 
        ${props.visible ? styles.label_editor__active: styles.label_editor__inactive}
        ${props.visible ? styles.visible : styles.hidden}`
      }
    >
      <LabelEditorRow>
        <select className={styles.label_preset_select}
          defaultValue={DefaultColorPresetName}
          onChange={onSelectedColorPresetChange}
        >
          { presetOptions }
        </select>
      </LabelEditorRow>
      <div className={styles.label_editor_row_box}>
        { labelRows }
      </div>
    </div>
  );
}