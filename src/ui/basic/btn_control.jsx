import { useState } from "react"
import styles from "./ui_basic.module.css"

export default function ButtonControl (props) {
  return (
    <button className={styles.btn_control} 
      onClick={props.onClick}
    >
      <img className={styles.btn_icon} src={ props.iconSrc }/>
    </button>
  );
}