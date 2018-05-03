import { templateResource } from "./templates";
import { expressResource } from "./expressions";

/**
 * @param {Array<Objects>} persona 
 * @returns {Array<Objects} the parsed persona reiterated by the chain of callbacks
 */
export const parsePersona = persona => iteratePersona(iteratePersona(iteratePersona(persona, templateResource), expressResource), pathResource);

/**
 * @param {Array<Objects>} persona entire persona tree
 * @param {Function} callback custom callback
 * @returns {Array<Objects} the iterated persona by the callback provided
 * Walks the persona tree and uses a provided callback function to apply necessary logic to prepare for the seeding
 */
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

/**
 * @param {Object} resource in context of persona resource objects
 * @param {Number} i 
 * @param {String} parentPath 
 */
function pathResource (resource = {}, i, parentPath) {
  const { type } = resource;
  return {
    ...resource,
    path: parentPath
      ? `${parentPath}.${type}[${i}]`
      : `${type}[${i}]`
  };
}