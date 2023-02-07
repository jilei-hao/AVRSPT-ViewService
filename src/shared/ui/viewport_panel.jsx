import { createContext, useContext, useState } from "react"
import { RenderContext } from "../model/context";
import { 
  canvasBox, tiledView, viewBoxes, viewPanelPos,
  viewConfig,
} from "../model/layout"

// const RenderContext = createContext("default");

export default function ViewportPanel(props) {
  const { viewId, onLayoutChange, panelVis} = props;
  const viewConf = viewConfig[viewId];
  const strPos = viewConf.position;
  const pos = viewPanelPos[strPos];
  const renConfig = viewConf.renConfig;
  const renType = renConfig.renType;
  const renId = renConfig.renId;

  const [top, setTop] = useState(pos.top);
  const [left, setLeft] = useState(pos.left);
  const getInfo = () => `Viewport Panel <${viewId}>: ${renType}-${renId}`;
  const renContext = useContext(RenderContext);
  // console.log(getInfo(), panelVis);

  const stylePanel = {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    top: top,
    left: left,
    visibility: panelVis,
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
    
    ren.setViewport(...canvasBox); // set to canvas size
    onLayoutChange(viewId, true); // switch other panels visibility

    // set this panel to top right
    setTop(viewPanelPos.topRight.top);
    setLeft(viewPanelPos.topRight.left);

    // hide other rendering views
    otherRen.forEach((e, i) => e.setViewport(0, 0, 0, 0));

    // render the canvas
    renContext.renderWindow.render();
  }

  function tiledView() {
    const ren = findRen();
    const otherRen = findOtherRen();

    // reset other views
    otherRen.forEach((e) => {
      const vid = e.get('viewId')['viewId'];
      const box = viewBoxes[viewConfig[vid].position];
      e.setViewport(...box);
      //console.log("tiledView: viewId = ", vid, "box=", box);
    })

    // reset this view
    ren.setViewport(...viewBoxes[viewConfig[viewId].position])

    // reset view panels visibilities
    onLayoutChange(viewId, false);
    

    // reset this panel location
    const pos = viewPanelPos[viewConfig[viewId].position];
    setTop(pos.top);
    setLeft(pos.left);

    renContext.renderWindow.render();


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