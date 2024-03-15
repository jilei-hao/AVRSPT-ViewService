import React, { useEffect, useRef } from "react";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";

export default function AVRPView (props) {
  const containerRef = useRef();
  const { viewId, pctTop, pctLeft, pctWidth, pctHeight } = props;
  const style = {
    position: 'absolute',
    top: `${pctTop}%`,
    left: `${pctLeft}%`,
    width: `${pctWidth}%`,
    height: `${pctHeight}%`,
    backgroundColor: 'green',
  };

  useEffect(() => {
    const container = containerRef.current;
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      rootContainer: container,
      containerStyle: { height: '100%', width: '100%', position: 'relative' },
    });
    const renderWindow = fullScreenRenderer.getRenderWindow();
    renderWindow.render();
    return () => {
      console.log("[AVRPView::useEffect] Clean up");
      fullScreenRenderer.delete();
    };
  }, [containerRef]);

  return (
    <div style={style} ref={containerRef}>
    </div>
  );
}