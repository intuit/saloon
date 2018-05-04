import * as expressionFns from './expressionFunctions';
import logger from './logger';

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
 * @param {String} value
 * Decides if it is an expression and returns the bool
 */
function shouldParseValue(value) {
  const EXP_START = '{{';
  const EXP_END = '}}';
  if (!value || typeof value !== 'string') {
    return false;
  }
  const start = value.indexOf(EXP_START);
  const end = value.indexOf(EXP_END);
  if (start !== -1 && end !== -1) {
    return true;
  }
  return false;
}

/**
 * @param {Object} obj
 * recurses over a given object in context of a persona param
 * and evaluates its expressions
 */
export function recurseObjects(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    const newAccumulator = { ...accumulator };
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      newAccumulator[key] = recurseObjects(value);
    } else {
      newAccumulator[key] = shouldParseValue(value) ? parse(value) : value;
    }
    return newAccumulator;
  }, {});
}

/**
 * Evaluates each expression within a collection of params.
 * @param {Object} resource The parameters to be seeded.
 * @returns {Object} The evaluated parameters to be seeded.
 */

export default function expressResource(resource) {
  return {
    ...resource,
    params: recurseObjects(resource.params),
  };
}
