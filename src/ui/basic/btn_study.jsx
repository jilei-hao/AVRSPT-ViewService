
import { useState } from "react";

import icon_palette__idle from "../assets/btn_palette__idle.svg"
import icon_palette__active from "../assets/btn_palette__active.svg"
import ButtonControl from "./btn_control"

export default function ButtonStudy (props) {
  const [active, setActive] = useState(false);

  function onClickLocal () {
    setActive(!active);
    props.onClick();
  }
  
  return (
    <ButtonControl 
      onClick={onClickLocal}
      iconSrc={active ? icon_palette__active : icon_palette__idle}
    />
  );
}