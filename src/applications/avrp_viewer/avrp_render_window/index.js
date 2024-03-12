import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";

export default class AVRPRenderWindow {
  constructor(id, containerRef, containerStyle) {
    console.log("[AVRPRenderWindow] id: ", id);
    this.m_Id = id;
    this.m_RenderWindow = vtkFullScreenRenderWindow.newInstance({
      rootContainer: containerRef,
      containerStyle: containerStyle,
    });
  }

  GetId() {
    return this.m_Id;
  }

  GetRenderWindow() {
    return this.m_RenderWindow.getRenderWindow();
  }

  // parameters in css string format
  SetPosition(top, left) {
    this.m_RenderWindow.setContainerStyle({ top: top, left: left });
  }

  // parameters in css string format
  SetSize(width, height) {
    this.m_RenderWindow.setContainerStyle({ width: width, height: height });
  }

}