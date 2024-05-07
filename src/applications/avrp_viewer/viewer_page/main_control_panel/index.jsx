import React from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';

export default function MainControlPanel () {
  const { setStudyBrowserActive } = useAVRPGlobal();

  const onExitClicked = () => {
    setStudyBrowserActive(true);
  };

  return (
    <div className={styles.panelContainer}>
      <button onClick={ onExitClicked }>EXIT</button>
    </div>
  );
}