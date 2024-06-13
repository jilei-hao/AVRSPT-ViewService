import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";

export default function useLabelDMP(defaultlabelRGBA) {
  const labelRGBA = defaultlabelRGBA; 

  function setlabelRGBA(newlabelRGBA) {
    labelRGBA = newlabelRGBA;
  }

  function getlabelRGBA() {
    return labelRGBA;
  }

  function getLabelColor(label) {
    return labelRGBA[label];
  }

  function getLabelRange() {
    const labels = Object.keys(labelRGBA);
    return [
      Math.min(...labels),
      Math.max(...labels)
    ];
  }

  function createLabelColorFunction() {
    const ctFun = vtkColorTransferFunction.newInstance();
    const { labelMin, labelMax } = getLabelRange();
    ctFun.setMappingRange(labelMin, labelMax);

    Object.entries(labelRGBA).forEach(([label, rgba]) => {
      ctFun.addRGBPoint(Number(label), rgba[0], rgba[1], rgba[2]);
    });

    ctFun.build();
    return ctFun;
  }

  function createLabelOpacityFunction() {
    const oFun = vtkPiecewiseFunction.newInstance();

    Object.entries(labelRGBA).forEach(([label, rgba]) => {
      oFun.addPointLong(Number(label), rgba[3], 0.5, 1);
    });

    return oFun;
  }

  return {
    setlabelRGBA,
    getlabelRGBA,
    getLabelColor,
    getLabelRange,
    createLabelColorFunction,
    createLabelOpacityFunction
  }
}