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
    console.log("[AVRPView::useEffect] creating rendering pipeline", rgbBackgroundColor)
    
    const genericRenderWindow = GenericRenderingWindow.newInstance({
      container: containerRef.current,
    });

    genericRenderWindow.setBackground(rgbBackgroundColor.r/255, rgbBackgroundColor.g/255, rgbBackgroundColor.b/255, 1);
    genericRenderWindow.render();

    return () => {
      console.log("[AVRPView::useEffect] Clean up");
      const container = containerRef.current;
      genericRenderWindow.dispose();
    };
  }, [containerRef]);

  return (
    <div id={`AVRPView-${viewId}`} style={style} ref={containerRef}>
    </div>
  );
}