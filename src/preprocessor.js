import { templateResource } from "./templates";
import { expressResource } from "./expressions";

export const parsePersona = persona => pathPersona(expressPersona(templatePersona(persona)));
export const templatePersona = persona => persona.map(layer => iterateResource(layer, templateResource));
export const expressPersona = persona => persona.map(layer => iterateResource(layer, expressResource));
export const pathPersona = persona => persona.map((layer, i) => iterateResource(layer, pathResource, i));

const iterateResource = (resource, callback, i, parentPath) => {
  const parsedResource = callback(resource, i, parentPath);
  const {children, path: currentPath} = parsedResource;
  if (children) {
    return {
      ...parsedResource,
      children: children.map((resource, i) => iterateResource(resource, callback, i, currentPath)
      )
    };
  } else {
    return parsedResource;
  }
};

const pathResource = (resource = {}, i, parentPath) => {
  const { type } = resource;
  return {
    ...resource,
    path: parentPath
      ? `${parentPath}.${type}[${i}]`
      : `${type}[${i}]`
  };
};