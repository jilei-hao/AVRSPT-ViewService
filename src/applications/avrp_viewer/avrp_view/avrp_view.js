import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";

export default class AVRPView {
  constructor(id, containerRef, initStyle) {
    console.log("[AVRPView] id: ", id);
    this.m_Id = id;
    this.m_ContainerRef = containerRef;
    this.m_RenderWindow = vtkFullScreenRenderWindow.newInstance({
      rootContainer: containerRef,
      containerStyle: initStyle
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
    // set the style of the container
    this.m_ContainerRef.style.position = 'absolute';
    this.m_ContainerRef.style.top = top;
    this.m_ContainerRef.style.left = left;
  }

  // parameters in css string format
  SetSize(width, height) {
    this.m_RenderWindow.setContainerStyle({ width: width, height: height });
  }

  Dispose() {
    this.m_RenderWindow.delete();
  }

}