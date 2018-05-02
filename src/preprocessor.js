import { templateProcessor } from "./templates";
import { expressionEvaluator } from "./expressions";

export const parsePersona = persona => {
  return pathPersona(expressPersona(templatePersona(persona)));
};

export const templatePersona = persona => {
  return persona.map(layer => peel(layer, template));
};

export const expressPersona = persona => {
  return persona.map(layer => peel(layer, express));
};

export const pathPersona = persona => {
  return persona.map((layer, i) => peel(layer, path, i));
};

const peel = (layer, cb, i, path) => {
  layer = cb(layer, i, path);
  if (layer.children) {
    return {
      ...layer,
      children: layer.children.map((resource, i) =>
        peel(resource, cb, i, layer.path)
      )
    };
  } else {
    return layer;
  }
};

/*eslint-disable no-unused-vars */
const template = layer => {
  if (layer.childrenTemplate) {
    const transformedLayer = {
      ...layer,
      children: templateProcessor(layer)
    };
    const {
      childrenCount,
      childrenTemplate,
      ...transformedLayerWithOmittedProps
    } = transformedLayer;

    return transformedLayerWithOmittedProps;
  } else {
    return layer;
  }
};

const express = layer => {
  return {
    ...layer,
    params: expressionEvaluator({ ...layer.params })
  };
};

const path = (layer, i, path) => {
  const parentPath = path;
  return {
    ...layer,
    path: parentPath
      ? `${parentPath}.${layer.type}[${i}]`
      : `${layer.type}[${i}]`
  };
};
