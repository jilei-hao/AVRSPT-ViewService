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

export const slicingConfig = [
  {
    id: 0,
    mode: SlicingMode.Z, 
    viewportPos: viewBoxes["topLeft"],
    viewUp: [0, -1, 0],
  }, 
  {
    id: 1,
    mode: SlicingMode.X, 
    viewportPos: viewBoxes["topRight"],
    viewUp: [0, 0, 1,]
  },
  {
    id: 2,
    mode: SlicingMode.Y, 
    viewportPos: viewBoxes["bottomRight"],
    viewUp: [0, 0, 1]
  }
];
