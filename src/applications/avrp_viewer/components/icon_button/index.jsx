import styles from './styles.module.css';

export default function IconButton({onClick, iconSrc, }) {
  return (
    <button className={styles.icon_button} onClick={onClick}>
        <img className={styles.icon_button_image} src={ iconSrc }/>
    </button>
  )
}