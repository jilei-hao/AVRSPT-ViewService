import styles from "./ui_composite.module.css"


export default function ProgressScreen (props) {

  return (
    <div className={
          `${styles.progress_screen}
          ${props.visible ? styles.visible : styles.hidden}`
        }
    >
      {`Loading... ${props.percentage}%`}
    </div>
  );
}