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

function GetLabelRange(labelRGBA) {
  const labels = Object.keys(labelRGBA);
  return [
    Math.min(...labels),
    Math.max(...labels)
  ];
}

function CreateLabelColorFunction (labelRGBA) {
  const ctFun = vtkColorTransferFunction.newInstance();
  let range = GetLabelRange(labelRGBA);

  ctFun.setMappingRange(range[0], range[1]);

  for (const k in labelRGBA) {
    const rgba = labelRGBA[k];
    ctFun.addRGBPoint(Number(k), rgba[0], rgba[1], rgba[2]);
  }

  ctFun.build();
  return ctFun;
}

function CreateLabelOpacityFunction (labelRGBA) {
  const oFun = vtkPiecewiseFunction.newInstance();
  for (const k in labelRGBA) {
    oFun.addPointLong(Number(k), labelRGBA[k][3], 0.5, 1);
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