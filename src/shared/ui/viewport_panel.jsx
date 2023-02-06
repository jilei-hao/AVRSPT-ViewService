import { createContext, useContext } from "react"
import { RenderContext } from "../model/context";

// const RenderContext = createContext("default");

export default function ViewportPanel(props) {
  const { top, left } = props;
  const renContext = useContext(RenderContext);
  console.log("ViewportPanel::renContext: ", renContext);

  const stylePanel = {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    top: top,
    left: left,
    width: "4vw",
    height: "12vw",
    borderRadius: "5px",
    backgroundColor: "rgb(228, 228, 228)",
    opacity: "1",
  }

  const styleButton = {
    width: "3vw",
    height: "3vw",
    borderRadius: "2%",
    marginTop: "2px",
    marginBottom: "2px",
    backgroundColor: "rgb(228, 228, 228)",
  }

  function fullScreen() {
    console.log("ViewportPanel::fullScreen()", renContext);
  }

  function tiledView() {
    console.log("ViewportPanel::tiledView()", renContext);
  }

  function resetView() {
    console.log("ViewportPanel::resetView()", renContext);
  }

  return (
    <div style={stylePanel}>
      <button style={styleButton} onClick={fullScreen}>
        [+]
      </button>
      <button style={styleButton} onClick={tiledView}>
        [-]
      </button>
      <button style={styleButton} onClick={resetView}>
        [R]
      </button>
    </div>
  );
}