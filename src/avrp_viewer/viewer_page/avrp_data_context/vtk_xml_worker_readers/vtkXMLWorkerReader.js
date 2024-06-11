import macro from "@kitware/vtk.js/macro";
import vtkXMLReader from "@kitware/vtk.js/IO/XML/XMLReader";
import parser from 'fast-xml-parser'

function vtkXMLWorkerReader(publicAPI, model) {
  model.classHierarchy.push('vtkXMLWorkerReader');

  console.log("[vtkXMLWorkerReader]: constructor");

  publicAPI.parseAsArrayBuffer = (arrayBuffer) => {
    const text = new TextDecoder().decode(arrayBuffer);
    const parsed = parser.parse(text);
    console.log(parsed);
  }
}

export function extend(publicAPI, model, initialValues = {}) {
  vtkXMLReader.extend(publicAPI, model, initialValues);

  vtkXMLWorkerReader(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkXMLWorkerReader');

export default { newInstance, extend };