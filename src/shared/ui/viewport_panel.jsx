import { createContext, useContext, useState, useRef, useEffect } from "react"
import { RenderContext } from "../model/context";
import { 
  canvasBox, tiledView, viewBoxes, viewPanelPos, viewConfig,
  getViewIdFromPos,
} from "../model/layout"

import ButtonReset from "../ui/basic/btn_reset"
import ButtonLayout from "../ui/basic/btn_layout"

// const RenderContext = createContext("default");

export function ViewportPanel(props) {
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
  const [btnLayoutMode, setBtnLayoutMode] = useState("full_screen");
  const isFullScreen = useRef(false);
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
    height: "9vw",
    padding: "0px",
    borderRadius: "2vw",
    backgroundColor: "rgb(72, 72, 72)",
    opacity: "1",
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

  function fnChangeLayout() {
    if (isFullScreen.current) {
      tiledView();
      isFullScreen.current = false;
      setBtnLayoutMode("full_screen");
    } else {
      fullScreen();
      isFullScreen.current = true;
      setBtnLayoutMode("split_screen");
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
      <ButtonLayout strSize={"3.5vw"} onClick={fnChangeLayout} mode={btnLayoutMode} />
      <ButtonReset strSize={"3.5vw"} onClick={resetView} />
    </div>
  );
}

export default function ViewPanelGroup(props) {
  const handleLayoutChange = props.onLayoutChange;
  const viewPanelVis = props.viewPanelVis;

  return (
    <div>
      <ViewportPanel viewId={getViewIdFromPos("topLeft")}
          onLayoutChange={handleLayoutChange} 
          panelVis={viewPanelVis[getViewIdFromPos("topLeft")]}
      />
      <ViewportPanel viewId={getViewIdFromPos("topRight")}
        onLayoutChange={handleLayoutChange} 
        panelVis={viewPanelVis[getViewIdFromPos("topRight")]}
      />
      <ViewportPanel viewId={getViewIdFromPos("bottomLeft")}
        onLayoutChange={handleLayoutChange} 
        panelVis={viewPanelVis[getViewIdFromPos("bottomLeft")]}
      />`
      <ViewportPanel viewId={getViewIdFromPos("bottomRight")}
        onLayoutChange={handleLayoutChange} 
        panelVis={viewPanelVis[getViewIdFromPos("bottomRight")]}
      />
    </div>
  );
}