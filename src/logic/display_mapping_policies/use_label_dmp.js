import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";

export default function useLabelDMP() {
  function getLabelRange(labelRGBA) {
    const labels = Object.keys(labelRGBA);
    return [
      Math.min(...labels),
      Math.max(...labels)
    ];
  }

  function createLabelColorFunction(labelRGBA) {
    const ctFun = vtkColorTransferFunction.newInstance();
    const range = getLabelRange(labelRGBA);
    ctFun.setMappingRange(range[0], range[1]);

    Object.entries(labelRGBA).forEach(([label, rgba]) => {
      ctFun.addRGBPoint(Number(label), rgba[0], rgba[1], rgba[2]);
    });

    ctFun.build();
    return ctFun;
  }

  function createLabelOpacityFunction(labelRGBA) {
    const oFun = vtkPiecewiseFunction.newInstance();

    Object.entries(labelRGBA).forEach(([label, rgba]) => {
      oFun.addPointLong(Number(label), rgba[3], 0.5, 1);
    });

    return oFun;
  }

  function normalizeLabelRGBA(labelRGBA) {
    const normalizedLabelRGBA = {};
    Object.entries(labelRGBA).forEach(([label, rgba]) => {
      normalizedLabelRGBA[label] = rgba.map(value => value / 255);
    });
    return normalizedLabelRGBA;
  }

  return {
    getLabelRange,
    createLabelColorFunction,
    createLabelOpacityFunction,
    normalizeLabelRGBA,
  }
}