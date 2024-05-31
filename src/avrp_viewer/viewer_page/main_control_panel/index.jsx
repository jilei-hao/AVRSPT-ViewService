import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { useAVRPGlobal } from '../../avrp_global_context';
import { useAVRPViewerState } from '../avrp_viewer_state_context';
import { BtnStepBack, BtnStepForward } from '@viewer/components'

export default function MainControlPanel () {
  const { setStudyBrowserActive } = useAVRPGlobal();
  const { activeTP, setActiveTP, numberOfTP } = useAVRPViewerState();
  const [ IsReplayOn, setIsReplayOn ] = useState(false);
  const replayTimerRef = useRef({});

  useEffect(() => {
    clearInterval(replayTimerRef.current);
    if (IsReplayOn)
      replayTimerRef.current = setInterval(onReplayTimerTick, 50);
  }, [IsReplayOn]);

  const onReplayTimerTick = () => {
    setActiveTP((currentActiveTP) => {
      const newTP = currentActiveTP + 1;
      if (newTP <= numberOfTP - 1) {
        return newTP;
      } else {
        return 0;
      }
    })
  }

  const onExitClicked = () => {
    setStudyBrowserActive(true);
  };

  const onStepbackClicked = () => {
    const newTP = activeTP - 1;
    if (newTP >= 0) {
      setActiveTP(newTP);
    }
  };

  const onReplayClicked = () => {
    setIsReplayOn(!IsReplayOn);
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
      <BtnStepBack onClick={ onStepbackClicked } />
      <button onClick={ onReplayClicked }>PLAY</button>
      <BtnStepForward onClick={ onStepForwardClicked } />
    </div>
  );
}