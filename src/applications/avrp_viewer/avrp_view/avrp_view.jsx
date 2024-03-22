import React, { useEffect, useRef } from "react";
import GenericRenderingWindow from "../../../rendering/GenericRenderingWindow";

export default function AVRPView (props) {
  const containerRef = useRef();
  const { 
    viewId, pctTop, pctLeft, pctWidth, pctHeight,
    rgbBackgroundColor
   } = props;
  const style = {
    position: 'absolute',
    top: `${pctTop}%`,
    left: `${pctLeft}%`,
    width: `${pctWidth}%`,
    height: `${pctHeight}%`,
    backgroundColor: 'green',
  };

  useEffect(() => {
    console.log("[AVRPView::useEffect] creating rendering pipeline")
    const container = containerRef.current;
    
    const genericRenderWindow = GenericRenderingWindow.newInstance({
      container: container,
    });

    genericRenderWindow.setBackground(rgbBackgroundColor.r/255, rgbBackgroundColor.g/255, rgbBackgroundColor.b/255, 1);
    genericRenderWindow.render();

    return () => {
      console.log("[AVRPView::useEffect] Clean up");
      genericRenderWindow.delete();
    };
  }, [containerRef]);

  return (
    <div style={style} ref={containerRef}>
    </div>
  );
}