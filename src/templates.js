const DEFAULT_TEMPLATE_CHILDREN = 10;

/**
 * Generates the supplied number of children templates.
 * @param {Object} resource The resource with `childrenTemplate` and `childrenCount`.
 * @returns {Array} An array of expanded child resources.
 */
function templateProcessor(resource) {
  const parsed = parseInt(resource.childrenCount, 10);
  const count = resource.childrenCount && !Number.isNaN(parsed)
    ? parsed
    : DEFAULT_TEMPLATE_CHILDREN;

  return [...Array(count).keys()].map((i) => {
    const template = Object.assign({}, resource.childrenTemplate);
    template.id = `${template.id}${i}`;
    return template;
  });
}

export default function templateResource(resource) {
  if (resource.childrenTemplate) {
    const transformedresource = {
      ...resource,
      children: templateProcessor(resource),
    };

    const {
      childrenCount,
      childrenTemplate,
      ...transformedresourceWithOmittedProps
    } = transformedresource;
    return transformedresourceWithOmittedProps;
  }
  return resource;
}
