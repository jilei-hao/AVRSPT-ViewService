import { createContext, useContext, useState } from "react"
import { RenderContext } from "../model/context";
import { canvasBox, tiledView, viewBoxes, slicingConfig, viewPanelPos } from "../model/layout"

// const RenderContext = createContext("default");

export default function ViewportPanel(props) {
  const { pos, renType, renId, onLayoutChange, panelVisibility} = props;
  const [top, setTop] = useState(pos.top);
  const [left, setLeft] = useState(pos.left);
  const getInfo = () => `Viewport Panel: ${renType}-${renId}`;
  const renContext = useContext(RenderContext);
  console.log(getInfo(), panelVisibility);

  const stylePanel = {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    top: top,
    left: left,
    visibility: panelVisibility,
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

  

  
  function findRen () {
    if (!renContext || renContext == "defaultRenderContext")
      return;
    
    switch(renType) {
      case "model":
        return renContext.modelRenderer;
      case "slice":
        return renContext.sliceRenderers[renId];
      default:
        console.error(getInfo(), ": unknown rendererType ", renType);
    }
  }

  function findOtherRen() {
    if (!renContext || renContext == "defaultRenderContext")
      return;

    switch(renType) {
      case "model":
        return renContext.sliceRenderers;
      case "slice": {
        let ret = [];
        ret.push(renContext.modelRenderer);
        renContext.sliceRenderers.forEach((e, i) => {
          if (i != renId)
            ret.push(e);
        })
        return ret;
      }
    }
  }

  function fullScreen() {
    const ren = findRen();
    const otherRen = findOtherRen();

    console.log(getInfo(), "::fullScreen()", ren, otherRen);
    
    ren.setViewport(...canvasBox);
    
    onLayoutChange(renType, renId, true);
    setTop(viewPanelPos.topRight.top);
    setLeft(viewPanelPos.topRight.left);

    otherRen.forEach((e, i) => e.setViewport(0, 0, 0, 0));
    renContext.renderWindow.render();
  }

  function tiledView() {
    console.log(getInfo(), "::tiledView()", renContext);
    onLayoutChange(renType, renId, false);

    setTop(props.pos.top);
    setLeft(props.pos.left);
  }

  function resetView() {
    const ren = findRen();
    console.log(getInfo(), "::resetView()", ren);
    ren.resetCamera();
    renContext.renderWindow.render();
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