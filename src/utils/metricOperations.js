/** 
 * Utility functions for parsing the text returned from the API that representes a 
 * metric operation
 * @param str
 * @param parts
 * @param lastIndex
 * @param endIndex


*/

const addPartToParts = (str, parts, lastIndex, endIndex) => {
  let part = str.slice(lastIndex, endIndex);
  if (part) {
    parts.push(part);
  }
  return parts;
};

/**
 * Count characters of a string
 * @param {*} str 
 * @param {*} chr 
 */
const countChar = (str, chr) => {
  return (str.match(new RegExp(chr, "g")) || []).length;
};

/**
 * Split string at certain points between certain points
 * @param str 
 * @param splitChars 
 * @param inChars 
 * @param outChars 
 */
export const splitAtLevel = (str, splitChars, inChars = "", outChars = "") => {
  let depth = 0;
  let lastIndex = 0;
  let parts = [];
  let part = null;
  for (let i = 0; i < str.length; i++) {
    let chr = str.charAt(i);
    if (inChars.includes(chr)) {
      depth += 1;
    }
    if (outChars.includes(chr)) {
      depth -= 1;
    }
    if (splitChars.includes(chr) && depth === 0) {
      parts = addPartToParts(str, parts, lastIndex, i);
      lastIndex = i + 1;
    }
  }
  parts = addPartToParts(str, parts, lastIndex, str.length);
  return parts;
};


/**
 * Validate operation string 
 * @param  parts 
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
 * 
 * Get Elements of a string between certain points
 * @param {String}  str 
 * @param  startChar 
 * @param  endChar 
 */
export const getBetween = (str, startChar, endChar) => {
  let depth = 0;
  let startIndex = null;
  let endIndex = null;
  for (let i = 0; i < str.length; i++) {
    let chr = str.charAt(i);
    if (chr === startChar) {
      if (depth === 0) {
        startIndex = i;
      }
      depth += 1;
    }
    if (chr === endChar) {
      depth -= 1;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (startIndex != null && endIndex != null) {
    return [str.slice(0, startIndex), str.slice(startIndex + 1, endIndex), str.slice(endIndex + 1, str.length)];
  }
  //console.warn("Match not found")
  return [null, str, null];
};
/**
 * metricOperations.js line 117
 * 
 * @param  text 
 * @param  opDetailList 
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
