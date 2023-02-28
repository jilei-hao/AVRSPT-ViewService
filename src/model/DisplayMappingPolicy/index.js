import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";


function CreateLabelDMP (labelConfig) {
  const ctFun = vtkColorTransferFunction.newInstance();
  const oFun = vtkPiecewiseFunction.newInstance();
  
  ctFun.setIndexedLookup(true);
  ctFun.setMappingRange(labelConfig.min, labelConfig.max);
  
  labelConfig.labels.forEach((e, i) => {
    ctFun.addRGBPoint(e.Number, e.RGBA[0], e.RGBA[1], e.RGBA[2]);
    oFun.addPoint(e.Number, e.RGBA[3]);
  });

  return {
    ColorTransferFunction: ctFun,
    OpacityFunction: oFun,
    ColorLevel: (labelConfig.max - labelConfig.min) / 2,
    ColorWindow: labelConfig.max - labelConfig.min,
  }
}


function CreateImageDMP (imageConfig) {
  const ctFun = vtkColorTransferFunction.newInstance();
  ctFun.addRGBPoint(0, 0, 0, 0);
  ctFun.addRGBPoint(1, 1, 1, 1);

  const oFun = vtkPiecewiseFunction.newInstance();
  
  return {
    ColorTransferFunction: ctFun,
    OpacityFunction: oFun,
    ColorLevel: 130,
    ColorWindow: 662,
  }

}

function CreateDisplayMappingPolicy (displayConfig) {

  return {
    LabelDMP: CreateLabelDMP(displayConfig.label),
    ImageDMP: CreateImageDMP(displayConfig.image),
    DisplayConfig: displayConfig,
  }
}


export { CreateDisplayMappingPolicy };