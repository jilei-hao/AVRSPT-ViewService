import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkLookupTable from "@kitware/vtk.js/Common/Core/LookupTable"

function CreateLabelRGBAMap(clrPreset, labelDesc) {
  const ret = new Map();
  const unknownRGBA = [1, 1, 1, 0];
  for (const k in labelDesc) {
    if (k in clrPreset ) {
      const normalized = clrPreset[k].map((e, i) => 
        i < 3 ? (e/255).toPrecision(2) : e
      );
      ret[k] = normalized;
    } else {
      ret[k] = unknownRGBA;
    }
  }
  return ret;
}

function GetLabelRange(labelRGBA, range) {
  const labels = Object.keys(labelRGBA);
  range[0] = Math.min(...labels);
  range[1] = Math.max(...labels);
}

function CreateLabelColorFunction (labelRGBA) {
  const ctFun = vtkColorTransferFunction.newInstance();
  let range = [];
  GetLabelRange(labelRGBA, range);

  ctFun.setMappingRange(range[0], range[1]);

  for (const k in labelRGBA) {
    const rgba = labelRGBA[k];
    ctFun.addRGBPoint(k, rgba[0], rgba[1], rgba[2]);
  }

  ctFun.build();
  return ctFun;
}

function CreateLabelOpacityFunction (labelRGBA) {
  const oFun = vtkPiecewiseFunction.newInstance();
  for (const k in labelRGBA) {
    oFun.addPoint(k, labelRGBA[k][3]);
  }
  return oFun;
}

function CreateImageColorFunction () {
  const ctFun = vtkColorTransferFunction.newInstance();
  ctFun.addRGBPoint(0, 0, 0, 0);
  ctFun.addRGBPoint(1, 1, 1, 1);
}

function CreateImageOpacityFunction () {
  const oFun = vtkPiecewiseFunction.newInstance();
  return oFun;
}



function CreateDMPHelper() {
  return {
    GetLabelRange,
    CreateLabelRGBAMap,
    CreateLabelColorFunction,
    CreateLabelOpacityFunction,
    CreateImageColorFunction,
    CreateImageOpacityFunction,
  }
}

export { 
  CreateDMPHelper
};