import templateResource from './templates';
import { expressResource } from './expressions';

function iteratePersona(persona, callback) {
  const iterateResource = (resource, callback, i, parentPath) => {
    const parsedResource = callback(resource, i, parentPath);
    const { children, path: currentPath } = parsedResource;
    if (children) {
      return {
        ...parsedResource,
        children: children.map((resource, i) => iterateResource(resource, callback, i, currentPath)),
      };
    }
    return parsedResource;
  };

  return persona.map((resource, i) => iterateResource(resource, callback, i));
}

function pathResource(resource = {}, i, parentPath) {
  const { type } = resource;
  return {
    ...resource,
    path: parentPath
      ? `${parentPath}.${type}[${i}]`
      : `${type}[${i}]`,
  };
}

function parsePersona(persona) {
  return iteratePersona(
    iteratePersona(iteratePersona(persona, templateResource), expressResource),
    pathResource,
  );
}

export default parsePersona;

