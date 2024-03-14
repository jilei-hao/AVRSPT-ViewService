
import styles from "./ui_composite.module.css"
import ButtonLayerTool from "../basic/btn_layer_tool"
import RoundSlider from "../basic/rounder_slider";

export default function CSLayerToolPanel (props) {
  return (
    <div className={styles.cs_layer_tool_panel}>
      <ButtonLayerTool ButtonText="LR" onClick={props.toggleSurface}/>
      <ButtonLayerTool ButtonText="LN" onClick={props.toggleSurface}/>
      <ButtonLayerTool ButtonText="RN" onClick={props.toggleSurface}/>
      <RoundSlider min={0} max={1} step={0.01} onChange={props.onTransSliderChange}/>
    </div>
  );
}