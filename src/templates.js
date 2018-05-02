const DEFAULT_TEMPLATE_CHILDREN = 10;

/**
 * Generates the supplied number of children templates.
 * @param {Object} resource The resource with `childrenTemplate` and `childrenCount`.
 * @returns {Array} An array of expanded child resources.
 */
export function templateProcessor(resource) {

    const parsed = parseInt(resource.childrenCount, 10);
    const count = resource.childrenCount && !isNaN(parsed)
        ? parsed
        : DEFAULT_TEMPLATE_CHILDREN;

    return [...Array(count).keys()].map(i => {
        const template = Object.assign({}, resource.childrenTemplate);
        template.id = `${template.id}${i}`;
        return template;
    });
}