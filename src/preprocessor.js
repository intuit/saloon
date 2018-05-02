import templateProcessor from './templates';
import { expressionEvaluator } from './expressions';

const peel = (layer, cb, i, path) => {
  layer = cb(layer, i, path);
  if (layer.children) {
    return {
      ...layer,
      children: layer.children.map((resource, i) =>
        peel(resource, cb, i, layer.path)),
    };
  }
  return layer;
};

/* eslint-disable no-unused-vars */
const template = (layer) => {
  if (layer.childrenTemplate) {
    const transformedLayer = {
      ...layer,
      children: templateProcessor(layer),
    };
    const {
      childrenCount,
      childrenTemplate,
      ...transformedLayerWithOmittedProps
    } = transformedLayer;

    return transformedLayerWithOmittedProps;
  }
  return layer;
};

const express = layer => ({
  ...layer,
  params: expressionEvaluator({ ...layer.params }),
});

const path = (layer, i, path) => {
  const parentPath = path;
  return {
    ...layer,
    path: parentPath
      ? `${parentPath}.${layer.type}[${i}]`
      : `${layer.type}[${i}]`,
  };
};

export const templatePersona = persona =>
  persona.map(layer => peel(layer, template));

export const expressPersona = persona =>
  persona.map(layer => peel(layer, express));

export const pathPersona = persona =>
  persona.map((layer, i) => peel(layer, path, i));

export const parsePersona = persona =>
  pathPersona(expressPersona(templatePersona(persona)));
