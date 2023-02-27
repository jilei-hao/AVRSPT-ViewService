
import icon_palette from "../assets/btn_palette__idle.svg"
import ButtonControl from "./btn_control"

export default function ButtonLabel (props) {
  
  return (
    <ButtonControl 
      onClick={props.onClick}
      iconSrc={icon_palette}
    />
  );
}