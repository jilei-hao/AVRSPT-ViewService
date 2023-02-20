import { useContext, useState, useRef, useEffect } from "react"
import { RenderContext } from "../../model/context"

import btn_play from "../assets/btn_play__idle.svg"
import btn_prev from "../assets/btn_prev__idle.svg"
import btn_next from "../assets/btn_next__idle.svg"
import btn_pause from "../assets/btn_pause__idle.svg"
import styles from "./ui_composite.module.css"

export function ReplayPanel(props) {
  const renContext = useContext(RenderContext);
  const tpSlider = useRef(null); // ref to the tp slider
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [currentTP, setCurrentTP] = useState(0); // storage tp is 0-based
  const [frameTimeInMS, setFrameTimeInMS] = useState(50);
  const [replayTimer, setReplayTimer] = useState({});

  function updateVisibleVolume(resetCamera = false) {
    if (renContext) {
      // console.log("updateVisibleVolume data:", tpVolumeData.current[currentTP]);
      const { sliceRenderers, renderWindow } = renContext;
      sliceRenderers.forEach((ren) => {
        const actor = ren.getActors()[0];
        const mapper = actor.getMapper();
        mapper.setInputData(tpVolumeData.current[currentTP]);

        if (resetCamera) {
          const camera = ren.getActiveCamera();
          const position = camera.getFocalPoint();

          // offset along the slicing axis
          const normal = mapper.getSlicingModeNormal();
          position[0] += normal[0];
          position[1] += normal[1];
          position[2] += normal[2];
          camera.setPosition(...position);
          ren.resetCamera();
        }
      })
      renderWindow.render();
    }
  }

  function updateVisibleSegmentation(resetCamera = false) {
    if (renContext) {
      // console.log("updateVisibleVolume data:", tpVolumeData.current[currentTP]);
      const { sliceRenderers, renderWindow } = renContext;
      // console.log("[updateVisibleSegmentatin] segData: ", tpSegmentationData.current[currentTP]);
      sliceRenderers.forEach((ren) => {
        const actor = ren.getActors()[1];
        // console.log("-- segActor = ", actor)
        const mapper = actor.getMapper();
        mapper.setInputData(tpSegmentationData.current[currentTP]);

        if (resetCamera) {
          const camera = ren.getActiveCamera();
          const position = camera.getFocalPoint();

          // offset along the slicing axis
          const normal = mapper.getSlicingModeNormal();
          position[0] += normal[0];
          position[1] += normal[1];
          position[2] += normal[2];
          camera.setPosition(...position);
          ren.resetCamera();
        }
      })
      renderWindow.render();
    }
  }

  function updateVisibleModel(resetCamera = false) {
    if (renContext) {
      //console.log("updateVisibleModel data:", tpModelData.current[currentTP]);
      const { modelRenderer, renderWindow } = renContext;
      const actor = modelRenderer.getActors()[0];
      const mapper = actor.getMapper();
      mapper.setInputData(tpModelData.current[currentTP]);

      if (resetCamera)
        modelRenderer.resetCamera();

      renderWindow.render();
    }
  }

  function updateVisibleDataset(resetCamera = false) {
    // console.log("Updating visible dataset");

    if (tpVolumeData.current.length > 0)
      updateVisibleVolume(resetCamera);
    if (tpModelData.current.length > 0)
      updateVisibleModel(resetCamera);
    if (tpSegmentationData.current.length > 0)
      updateVisibleSegmentation(resetCamera);
  }

  function updateSlider(len) {
    if (renContext && tpSlider.current) {
      const slider = tpSlider.current;
      slider.min = 1;
      slider.max = len;
    }
  }

  useEffect(() => {
    if (renContext) {
      console.log("Current TP Changed to: ", currentTP);
      updateVisibleDataset();
    }
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
    const l = cases[crntCase].nT;
    setCurrentTP(prevTP => l - 1 - (l - prevTP) % l);
  }

  function onNextClicked() {
    setCurrentTP(prevTP => (prevTP + 1) % cases[crntCase].nT);
  }

  return (
    <div className={styles.replay_panel}>
      <button className={styles.toolbar_button__s}
        onClick={onPreviousClicked}
      >
        <img className={styles.icon_image__s} src={ btn_prev }/>
      </button>
      <input className={styles.touch_slider} ref={tpSlider}
        type="range" min="1" max="1"
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