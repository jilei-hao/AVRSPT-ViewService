
import { useState } from "react";

import icon_palette__idle from "../assets/btn_palette__idle.svg"
import icon_palette__active from "../assets/btn_palette__active.svg"
import ButtonText from "./btn_text"

export default function ButtonStudy (props) {
  const [active, setActive] = useState(false);

  function onClickLocal () {
    setActive(!active);
    props.onClick();
  }
  
  return (
    <ButtonText
      onClick={onClickLocal}
      text={props.btnText}
    />
  );
}