import { useState } from "react"

import uiBasicStyle from "./ui_basic.module.css"
import btnSegVis_unchked from "../assets/btn_segvis__unchked.svg"



export default function CheckButtonSegVis ({strSize, onClick}) {
  const [checked, setChecked] = useState(true);

  function handleClick() {
    console.log(`[CheckButtonSegVis]: checked=${checked}`);
    setChecked(!checked);
  }

  return (
    <button 
      className={
        `${uiBasicStyle.chkbtn_vis} 
        ${checked ? uiBasicStyle.chkbtn_vis__chked : uiBasicStyle.chkbtn_vis__unchked}`
      } 
      onClick={handleClick}
    >
      <img className={uiBasicStyle.btn_icon} src={btnSegVis_unchked} />
    </button>
  );
}