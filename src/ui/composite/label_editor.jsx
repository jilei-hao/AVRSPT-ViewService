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

function LabelConfigPanel ({rgba, label, desc, onOpacityChange}) {
  // Configure parent render scene and local state at same time
  function onOpacityChangeLocal (e) {
    onOpacityChange(label, e.target.value);
  }

  const styleColorBlock = {
    width: "30px",
    height: "30px",
    marginLeft: "7px",
    marginRight: "5px",
    borderRadius: "3px",
    backgroundColor: `rgb(${rgba[0]*255}, ${rgba[1]*255}, ${rgba[2]*255})`,
  }

  return (
    <LabelEditorRow>
      <div style={styleColorBlock} />
      <div className={styles.label_desc_box}>{desc}</div>
      <input className={styles.touch_slider}
        type="range" min="0" max="1" step="0.01" 
        value={rgba[3]} onChange={onOpacityChangeLocal}
      />
    </LabelEditorRow>
  )
}

function LabelConfigPanelList({panelList, onOpacityChange}) {
  return (
    <div className={styles.label_editor_row_box}>
      { 
        panelList.map((item) => (
          <LabelConfigPanel key={item.label} label={item.label}
          desc={item.desc} rgba={item.rgba}
          onOpacityChange={onOpacityChange}
          />
        ))
      }
    </div>
  );
}

export default function LabelEditor (props) {
  if (!props.initLabelConfig)
    return;

  const { initLabelConfig, onOpacityChange, onColorChange } = props;
  const { LabelDescription, ColorPresets, DefaultColorPresetName } = initLabelConfig
  const defaultPreset = ColorPresets[DefaultColorPresetName]

  const DMPHelper = CreateDMPHelper();
  const initLabelRGBA = DMPHelper.CreateLabelRGBAMap(defaultPreset, LabelDescription);
  const [labelRGBA, setLabelRGBA] = useState(initLabelRGBA);

  function createPanelList(rgbaMap) {
    const pl = [];
    for (const label in LabelDescription) {
      pl.push({
        label: label, desc: LabelDescription[label], rgba: rgbaMap.get(label)
      });
    }
    return pl;
  }

  const [panelList, setPanelList] = useState(createPanelList(initLabelRGBA));

  function onOpacityChangeLocal (label, value) {
    let rgbaMap = labelRGBA;
    let rgba = rgbaMap.get(label);
    rgba[3] = value;
    rgbaMap.set(label, rgba);
    setLabelRGBA(rgbaMap); // update active rgba map
    onOpacityChange(rgba); // change rendering
    setPanelList(createPanelList(rgbaMap)); // update panel list ui
  }

  function onSelectedColorPresetChange (e) {
    const selectedPresetName = e.target.value;
    const selectedPreset = ColorPresets[selectedPresetName];
    
    const rgba = DMPHelper.CreateLabelRGBAMap(selectedPreset, LabelDescription);
    setLabelRGBA(rgba); // Trigger UI change
    onColorChange(rgba);
    onOpacityChange(rgba);
    setPanelList(createPanelList(rgba)); // update panel list ui
  }

  // Build Preset Options
  const presetOptions = []; 
  for (const k in ColorPresets) {
    presetOptions.push(
    <option key={k} value={k}>
      {k}
    </option>);
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
      <LabelConfigPanelList panelList={panelList}
        onOpacityChange={onOpacityChangeLocal} />
    </div>
  );
}