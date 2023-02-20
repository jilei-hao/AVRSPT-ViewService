import macro from '@kitware/vtk.js/macro';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';

function InteractorStyleImageTouch(publicAPI, model) {
  model.classHierarchy.push('InteractorStyleImageTouch');

  publicAPI.superHandleLeftButtonPress = publicAPI.handleLeftButtonPress;
  publicAPI.handleLeftButtonPress = (callData) => {
    // console.log("<LeftButtonPress>");

    const pos = callData.position;
    model.previousPosition = pos;

    const ren = callData.pokedRenderer;
    const renType = ren.get('rendererType')['rendererType'];
    callData.controlKey = true;
    model.ISITInitRenType = renType;
    
    // console.log("Renderer Type: ", renType);

    switch (renType) {
      case 'slice': {
        callData.controlKey = true;
        publicAPI.superHandleLeftButtonPress(callData);
        break;
      }

      case 'model': {
        publicAPI.handleStartRotate(callData);
      }
    }
  }

  publicAPI.ISITParentHandleMouseMove = publicAPI.handleMouseMove;
  publicAPI.handleMouseMove = (callData) => {
    const pos = callData.position;
    const renderer = callData.pokedRenderer;

    const renType = renderer.get('rendererType')['rendererType'];
    // console.log("<handleMouseMove> renType: ", renType,
    //   "; init renType: ", model.ISITInitRenType);

    if (renType != model.ISITInitRenType)
      return;

    publicAPI.ISITParentHandleMouseMove(callData);
  }
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  vtkInteractorStyleImage.extend(publicAPI, model, initialValues);

  InteractorStyleImageTouch(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'InteractorStyleImageTouch');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
  