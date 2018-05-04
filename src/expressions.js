import * as expressionFns from './expressionFunctions';
import logger from './logger';

const EXP_START = '{{';
const EXP_END = '}}';

/**
 * Parses an expression.
 * @param {string} exp The raw model value.
 * @returns {string} The parsed model value.
 */
function parse(exp) {
  const fnArgsStart = exp.indexOf('(');
  const fnArgsEnd = exp.indexOf(')');
  const fnName = exp.substring(2, fnArgsStart);

  if (typeof expressionFns[fnName] !== 'function') {
    logger.warn(`Expression function not found: ${fnName}`);
    return exp;
  }

  let args = exp.substring(fnArgsStart + 1, fnArgsEnd);

  if (args.length) {
    args = args.split(',').map((arg) => {
      const parsed = parseInt(arg, 10);
      return Number.isNaN(parsed) ? arg.trim().replace(/'/g, '') : parsed;
    });
  }

  return expressionFns[fnName](...args || []);
}

/**
 * Evaluates each expression within a collection of params.
 * @param {Object} data The parameters to be seeded.
 * @returns {Object} The evaluated parameters to be seeded.
 */
export function expressionEvaluator(data) {
  const newData = { ...data };
  Object.entries(newData).forEach(([key]) => {
    if (!newData[key] || typeof newData[key] !== 'string') {
      return newData[key];
    }

    const start = newData[key].indexOf(EXP_START);
    const end = newData[key].indexOf(EXP_END);

    if (start !== -1 && end !== -1) {
      newData[key] = parse(newData[key]);
    }
    return true;
  });

  return newData;
}
/**
 * @param {<Object>} resource a resource in context persona resource objects
 * @returns {<Object>} the resource templated per templateProcessor rules
 */
export function evaluateExpressions(resource) {
  return {
    ...resource,
    params: expressionEvaluator(resource.params),
  };
}
