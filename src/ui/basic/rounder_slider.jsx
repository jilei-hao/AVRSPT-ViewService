import React from 'react';

import styles from './ui_basic.module.css';

export default function RoundSlider({ min, max, step, onChange }) {
  return (
    <input className={styles.round_slider}
      type="range"
      min={min}
      max={max}
      step={step}
      onChange={onChange}
    />
  );
}