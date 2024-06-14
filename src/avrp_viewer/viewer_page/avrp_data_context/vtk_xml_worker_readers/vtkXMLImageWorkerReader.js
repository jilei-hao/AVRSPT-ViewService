import vtkXMLWorkerReader from "./vtkXMLWorkerReader";

function vtkXMLImageWorkerReader(publicAPI, model) {
  model.classHierarchy.push('vtkXMLImageWorkerReader');

  console.log("[vtkXMLImageWorkerReader]: constructor");

  publicAPI.parseAsArrayBuffer = (arrayBuffer) => {
    const text = new TextDecoder().decode(arrayBuffer);
    const parsed = parser.parse(text);
    console.log(parsed);
  }
}

export function extend(publicAPI, model, initialValues = {}) {
  vtkXMLWorkerReader.extend(publicAPI, model, initialValues);

  vtkXMLImageWorkerReader(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkXMLWorkerReader');

export default { newInstance, extend };