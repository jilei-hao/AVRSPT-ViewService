import React from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';

export default function MainControlPanel () {
  const { setStudyBrowserActive } = useAVRPGlobal();

  const onExitClicked = () => {
    setStudyBrowserActive(true);
  };

  const onStepbackClicked = () => {
    console.log("onStepbackClicked");
  };

  const onPlayClicked = () => {
    console.log("onPlayClicked");
  }

  const onStepForwardClicked = () => {
    console.log("onStepForwardClicked");
  }

  return (
    <div className={styles.panelContainer}>
      <button onClick={ onExitClicked }>EXIT</button>
      <button onClick={ onStepbackClicked }>BACK</button>
      <button onClick={ onPlayClicked }>PLAY</button>
      <button onClick={ onStepForwardClicked }>FORWARD</button>
    </div>
  );
}