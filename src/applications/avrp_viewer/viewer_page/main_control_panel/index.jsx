import React from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';
import { useAVRPViewerState } from '../avrp_viewer_state_context';

export default function MainControlPanel () {
  const { setStudyBrowserActive } = useAVRPGlobal();
  const { activeTP, setActiveTP, numberOfTP } = useAVRPViewerState();

  const onExitClicked = () => {
    setStudyBrowserActive(true);
  };

  const onStepbackClicked = () => {
    const newTP = activeTP - 1;
    if (newTP >= 0) {
      setActiveTP(newTP);
    }
  };

  const onPlayClicked = () => {
    console.log("onPlayClicked");
  }

  const onStepForwardClicked = () => {
    const newTP = activeTP + 1;
    if (newTP <= numberOfTP - 1) {
      setActiveTP(newTP);
    }
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