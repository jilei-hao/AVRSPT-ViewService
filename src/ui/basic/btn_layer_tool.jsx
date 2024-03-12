import { useState } from "react"
import styles from "./ui_basic.module.css"

export default function ButtonLayerTool (props) {
  const [active, setActive] = useState(true);

  function onClickLocal () {
    setActive(!active);
    props.onClick(props.ButtonText);
  }

  return (
    <button 
      className={
      `${styles.btn_layer_tool} 
      ${active ? styles.btn_layer_tool__active : styles.btn_layer_tool__inactive}`
    }
      onClick={onClickLocal}
    >
      {props.ButtonText}
    </button>
  );
}