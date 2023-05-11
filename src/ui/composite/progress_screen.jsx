import styles from "./ui_composite.module.css"


export default function ProgressScreen (props) {

  return (
    <div className={styles.progress_screen}>
      {`Loading... ${props.percentage}%`}
    </div>
  );
}