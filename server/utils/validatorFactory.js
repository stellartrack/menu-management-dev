import { body, param, query } from "express-validator";

/**
 * Supported locations for validation (body, param, query)
 */
const locationMap = {
  body,
  param,
  query,
};

/**
 * Create a validation middleware array based on field definitions per source.
 * 
 * Example input:
 * {
 *   body: {
 *     name: [["notEmpty", "Name is required"]],
 *     age: [["isInt", "Age must be a number"]],
 *   },
 *   param: {
 *     id: [["notEmpty", "ID is required"]],
 *   },
 * }
 */
export const createValidators = (schema = {}) => {
  const validators = [];

  Object.entries(schema).forEach(([source, fields]) => {
    const validatorFn = locationMap[source];
    if (!validatorFn) return;

    Object.entries(fields).forEach(([field, rules]) => {
      let chain = validatorFn(field);
      rules.forEach((rule) => {
        const [method, ...args] = rule;
        chain = chain[method](...args);
      });
      validators.push(chain);
    });
  });

  return validators;
};
