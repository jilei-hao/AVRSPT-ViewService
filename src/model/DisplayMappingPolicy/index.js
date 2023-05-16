import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkLookupTable from "@kitware/vtk.js/Common/Core/LookupTable"
import vtkDataArray from "@kitware/vtk.js/Common/Core/DataArray";

function CreateLabelRGBAMap(clrPreset, labelDesc) {
  const ret = new Map();
  const unknownRGBA = [1, 1, 1, 0];
  for (const k in labelDesc) {
    if (k in clrPreset ) {
      const normalized = clrPreset[k].map((e, i) => 
        i < 3 ? (e/255).toPrecision(2) : e
      );
      ret.set(k, normalized);
    } else {
      ret.set(k, unknownRGBA);
    }
  }
  return ret;
}

function GetLabelRange(labelRGBA) {
  const labels = [...labelRGBA.keys()];
  return [
    Math.min(...labels),
    Math.max(...labels)
  ];
}

function CreateLabelColorFunction (labelRGBA) {
  const ctFun = vtkColorTransferFunction.newInstance();
  let range = GetLabelRange(labelRGBA);
  ctFun.setMappingRange(range[0], range[1]);

  labelRGBA.forEach((v, k) => {
    ctFun.addRGBPoint(Number(k), v[0], v[1], v[2]);
  })

  ctFun.build();
  return ctFun;
}

function CreateLabelOpacityFunction (labelRGBA) {
  const oFun = vtkPiecewiseFunction.newInstance();

  labelRGBA.forEach((v, k) => {
    oFun.addPointLong(Number(k), v[3], 0.5, 1);
  })

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

function CreateRGBADataArray(labelArray, labelRGBA) {
  /* labelArray: vtkDataArray; labelRGBA: map */
  console.log(`[CreateRGBADataArray]: `, labelArray, labelRGBA);
  const arrSize = labelArray.getNumberOfTuples();
  const arrNoC = 4;
  const rgbaBuffer = new Uint8Array(arrNoC * arrSize);

  for (let i = 0; i < labelArray.getNumberOfTuples(); i++) {
    const label = labelArray.getData()[i];
    const rgba = labelRGBA[label];
    for (let j = 0; j < 4; j++) {
      if (j < 3)
        rgbaBuffer[i + j] = rgba[j] * 255;
      else
        rgbaBuffer[i + j] = rgba[j];
    }
  }

  const rgbaArr = vtkDataArray.newInstance({
      numberOfComponents: 4,
      name: "RGBA",
      size: arrSize * arrNoC,
      dataType: 'Uint8Array',
      values: rgbaBuffer
    });
  console.log("-- rgbaArr: ", rgbaArr);

  return rgbaArr;
}

function CreateLabelLUT(labelRGBA) {
  //console.log(`[CreateLabelLUT] labelRGBA`, labelRGBA);
  const numberOfColors = labelRGBA.size;
  const tableBuffer = new Uint8Array(4 * numberOfColors);
  const range = GetLabelRange(labelRGBA);
  const lut = vtkLookupTable.newInstance();
  lut.setIndexedLookup(true);
  lut.setRange(range[0], range[1]);
  lut.setNumberOfColors(numberOfColors);

  // make sure label number is mapped to the table
  for (let i = 0; i < numberOfColors; i++) {
    lut.setAnnotation(i, i);
  }

  let offset = 0;
  for (const [key, value] of labelRGBA) {
    for (let i = 0; i < 4; i++)
      tableBuffer[offset++] = value[i] * 255;
  }

  //console.log(`[CreateLabelLUT] NoC: ${numberOfColors} `, tableBuffer);

  const table = vtkDataArray.newInstance({
    numberOfComponents: 4,
    size: 4 * numberOfColors,
    dataType: 'Uint8Array',
    name: "LabelLUT",
    values: tableBuffer,
  });

  lut.setTable(table);

  return lut;
}

function CreateDMPHelper() {
  return {
    GetLabelRange,
    CreateLabelRGBAMap,
    CreateLabelColorFunction,
    CreateLabelOpacityFunction,
    CreateImageColorFunction,
    CreateImageOpacityFunction,
    CreateRGBADataArray,
    CreateLabelLUT,
  }
}

export { 
  CreateDMPHelper
};