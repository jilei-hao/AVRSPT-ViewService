import { useContext, useState, useRef, useEffect } from "react"
import { RenderContext } from "../../model/context"

import btn_play from "../assets/btn_play__idle.svg"
import btn_prev from "../assets/btn_prev__idle.svg"
import btn_next from "../assets/btn_next__idle.svg"
import btn_pause from "../assets/btn_pause__idle.svg"
import styles from "./ui_composite.module.css"

export function ReplayPanel({nT, updateVisibleDataset}) {
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [currentTP, setCurrentTP] = useState(0); // storage tp is 0-based
  const [frameTimeInMS, setFrameTimeInMS] = useState(50);
  const [replayTimer, setReplayTimer] = useState({});

  useEffect(() => {
    updateVisibleDataset(currentTP, false);
  }, [currentTP]);

  useEffect(() => {
    clearInterval(replayTimer);
    if (isReplayOn) {
      setReplayTimer(setInterval(onNextClicked, frameTimeInMS));
    }
  }, [frameTimeInMS, isReplayOn]);

  function onReplayClicked() {
    setIsReplayOn(!isReplayOn);
  }

  function onPreviousClicked() {
    setCurrentTP(prevTP => nT - 1 - (nT - prevTP) % nT);
  }

  function onNextClicked() {
    setCurrentTP(prevTP => (prevTP + 1) % nT);
  }

  return (
    <div className={`${styles.replay_panel}`}>
      <button className={styles.toolbar_button__s}
        onClick={onPreviousClicked}
      >
        <img className={styles.icon_image__s} src={ btn_prev }/>
      </button>
      <input className={styles.touch_slider}
        type="range" min="1" max={nT}
        value={currentTP + 1}
        onChange={(ev) => setCurrentTP(Number(ev.target.value - 1))}
      />
      <button className={styles.toolbar_button__s}
        onClick={onNextClicked}
      >
        <img className={styles.icon_image__s} src={ btn_next }/>
      </button>
      <button className={styles.toolbar_button__s}
        onClick={onReplayClicked}
      >
        <img className={styles.icon_image__s} 
        src={ isReplayOn ? btn_pause : btn_play } />
      </button>
    </div>
  );
}