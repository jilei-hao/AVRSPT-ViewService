import React, { useEffect, useRef } from "react";

export default function AVRPView (props) {
  const containerRef = useRef();

  const { 
    viewId, pctTop, pctLeft, pctWidth, pctHeight,
    setWindowContainer, children
   } = props;

  const style = {
    position: 'absolute',
    top: `${pctTop}%`,
    left: `${pctLeft}%`,
    width: `${pctWidth}%`,
    height: `${pctHeight}%`,
    backgroundColor: 'green',
    border: '1px solid white',
  };

  useEffect(() => {
    setWindowContainer(containerRef.current);

    return () => {
    };
  }, [containerRef]);

  return (
    <div id={`AVRPView-${viewId}`} style={style} ref={containerRef}>
      { children }
    </div>
  );
}