import { templateResource } from "./templates";
import { expressResource } from "./expressions";

export const parsePersona = persona => iteratePersona(iteratePersona(iteratePersona(persona, templateResource), expressResource), pathResource);

function iteratePersona (persona, callback) {
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

    return persona.map((resource, i) => {
      return iterateResource(resource, callback, i);
    });
}

function pathResource (resource = {}, i, parentPath) {
  const { type } = resource;
  return {
    ...resource,
    path: parentPath
      ? `${parentPath}.${type}[${i}]`
      : `${type}[${i}]`
  };
}