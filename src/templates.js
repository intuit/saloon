const DEFAULT_TEMPLATE_CHILDREN = 10;

/**
 * Recursively appends indices to each output property.
 * @param {*} i The index of each processed child template.
 * @param {*} output The resource's output object.
 * @param {*} target The "recursed" child value.
 * @returns {Object} The resolved key/value output pair.
 */
function processOutput(i, output, target = null) {
    if (Array.isArray(output)) {
        return output.map(processOutput.bind(this, i));
    }

    if (typeof output === 'object') {
        return Object.keys(output).map(key => {
            return processOutput(i, key, output[key]);
        });
    }

    return { [(isNaN(i) ? `${i}.${output}` : `${output}${i}`)]: (target || output) };
}

function processChildren(outputPrefix, children) {
    const output =  children.map(child => {
        if (child.output) {
            child = Object.assign({}, child);
            child.output = processOutput(`${outputPrefix}`, child.output);
        }
        return child;
    });
    return output;
}

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

        if (template.output) {
            template.output = processOutput(i, template.output);
        }

        if (template.children) {
            template.children = processChildren(`${template.type}${i}`, template.children);
        }

        return template;
    });
}