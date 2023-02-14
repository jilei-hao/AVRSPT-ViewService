import Constants from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
const { SlicingMode } = Constants;

// all measurements start from bottom left corner, with range [0, 1]

export const canvasBox = [0, 0.1, 1, 1];

const getCanvasHeight = () => canvasBox[3] - canvasBox[1];
const getCanvastWidth = () => canvasBox[2] - canvasBox[0];

export const tiledView = {
  horizontalSplitter: 0.5,
  verticalSplitter: 0.5,
}

export const viewBoxes = {
  "topLeft": [
    canvasBox[0],
    canvasBox[1] + getCanvasHeight() * tiledView.horizontalSplitter,
    canvasBox[0] + getCanvastWidth() * tiledView.verticalSplitter,
    canvasBox[3],
  ],
  "topRight": [
    canvasBox[0] + getCanvastWidth() * tiledView.verticalSplitter,
    canvasBox[1] + getCanvasHeight() * tiledView.horizontalSplitter,
    canvasBox[2],
    canvasBox[3],
  ],
  "bottomLeft": [
    canvasBox[0],
    canvasBox[1],
    canvasBox[0] + getCanvastWidth() * tiledView.verticalSplitter,
    canvasBox[1] + getCanvasHeight() * tiledView.horizontalSplitter,
  ],
  "bottomRight": [
    canvasBox[0] + getCanvastWidth() * tiledView.verticalSplitter,
    canvasBox[1],
    canvasBox[2],
    canvasBox[1] + getCanvasHeight() * tiledView.horizontalSplitter,
  ],
};

export const viewPanelPos = {
  "topLeft": { "top": "5vh", "left": "45vw"},
  "topRight": { "top": "5vh", "left": "95vw"},
  "bottomLeft": { "top": "50vh", "left": "45vw"},
  "bottomRight": { "top": "50vh", "left": "95vw"},
}

export const viewConfig = [
  {
    viewId: 0,
    position: "topLeft",
    renConfig: { 
      renType: "slice",
      renId: 0, // unique for each ren type
      viewUp: [0, -1, 0],
      mode: SlicingMode.Z
    }
  },
  {
    viewId: 1,
    position: "topRight",
    renConfig: { 
      renType: "slice",
      renId: 1, // unique for each ren type
      viewUp: [0, 0, 1],
      mode: SlicingMode.X
    }
  },
  {
    viewId: 2,
    position: "bottomLeft",
    renConfig: { 
      renType: "model",
      renId: 0, // unique for each ren type
    }
  },
  {
    viewId: 3,
    position: "bottomRight",
    renConfig: { 
      renType: "slice",
      renId: 2, // unique for each ren type
      viewUp: [0, 0, 1],
      mode: SlicingMode.Y
    }
  },
]

export const sliceViewMap = [0, 1, 3] // top left, top right, bottom right
export const modelViewMap = [2]; // bottom left
export const getViewIdFromPos = (pos) => {
  for (let i = 0; i < viewConfig.length; i++) {
    if (viewConfig[i].position == pos)
      return viewConfig[i].viewId;
  }
  return -1;
}
