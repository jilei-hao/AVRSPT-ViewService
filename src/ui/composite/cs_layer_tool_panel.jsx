
import styles from "./ui_composite.module.css"
import ButtonLayerTool from "../basic/btn_layer_tool"

export default function CSLayerToolPanel (props) {

  return (
    <div className={styles.cs_layer_tool_panel}>
      <ButtonLayerTool ButtonText="LR" onClick={props.toggleSurface}/>
      <ButtonLayerTool ButtonText="LN" onClick={props.toggleSurface}/>
      <ButtonLayerTool ButtonText="RN" onClick={props.toggleSurface}/>
    </div>
  );
}