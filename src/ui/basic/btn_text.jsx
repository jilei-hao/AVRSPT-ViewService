import { useState } from "react"
import styles from "./ui_basic.module.css"

export default function ButtonText (props) {
  return (
    <button className={styles.btn_text} 
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}