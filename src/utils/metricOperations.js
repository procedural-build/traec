import { getBetween, splitAtLevel, countChar } from "./text";

/**
 * Utility functions for parsing the text returned from the API that representes a
 * metric operation
 * @namespace metricOperations
 * @memberof utils
 *
 */

/**
 * Validate operation string
 * @method
 * @memberof utils.metricOperations
 * @param  {array} - Parts should be three (3) parts to the operation: 1) factor, 2) operation and 3) exponent
 */
export const validateOpStr = parts => {
  // let parts = splitAtLevel(text, "*^", "([", "])")
  if (parts.length == 3) {
    throw "Expected the form: factor * [] ^ exponent";
  }
  if (isNaN(parts[0])) {
    throw "factor should be a float";
  }
  if (isNaN(parts[2])) {
    throw "exponent should be a float";
  }
  if (!(countChar(parts[1], "[") == countChar(parts[1], "]"))) {
    throw "Mismatching braces []";
  }
  if (!(countChar(parts[1], "(") == countChar(parts[1], ")"))) {
    throw "Mismatching braces ()";
  }
  return parts;
};

/**
 * Extracts all of the individual (possibly nested) operations from the text returned from the API.
 * Note this method is recursive
 * @method
 * @memberof utils.metricOperations
 * @param {String} text - the text to extract
 * @param {Array} opDetailList - the list of operations gathered so far in the recursive calls (leave empty for general use)
 * @returns {Array} - the list of operations
 */
export const getAllOps = (text, opDetailList = []) => {
  let parts = splitAtLevel(text, "*^", "([", "])");
  let ops = getBetween(parts[1], "[", "]")[1];
  let [op, inner, end] = getBetween(ops, "(", ")");
  let [metricOuter, subOperationsOuter] = splitAtLevel(inner, ",", "([", "])");
  let [metricOp, metricList, metricsEnd] = getBetween(metricOuter, "(", ")");
  let [childOp, childOpsList, childOpsEnd] = getBetween(subOperationsOuter, "(", ")");
  // Append the details of this level to the opDetailsList
  opDetailList.push({
    op,
    metricOp,
    childOp,
    metricList,
    factor: parts[0],
    exponent: parts[2]
  });
  // RECURSE down into child operations
  let childOps = splitAtLevel(childOpsList, ",", "([", "])");
  for (let child of childOps) {
    opDetailList = getAllOps(child, opDetailList);
  }
  // Return the detils of this and child operations
  return opDetailList;
};
