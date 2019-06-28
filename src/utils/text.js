/**
 * Utility functions for parsing the text
 * @namespace text
 * @memberof utils
 */

/**
 * Split string that is only at the first level of a possibly nested series
 * set of stings between bracket characters marked by "inChars" and "outChars"
 * @memberof utils.text
 * @param {String} str - the string
 * @param {String} splitChars- the characters to split
 * @param {String} inChars - characters marking the start of brackets
 * @param {String} outChars - characters marking the end of brackets
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

const addPartToParts = (str, parts, lastIndex, endIndex) => {
  let part = str.slice(lastIndex, endIndex);
  if (part) {
    parts.push(part);
  }
  return parts;
};

/**
 * Count number of occurances of a character in a string
 * @memberof utils.text
 * @param {String} str - The string
 * @param {Char} chr - The character to count occurances of
 */
const countChar = (str, chr) => {
  return (str.match(new RegExp(chr, "g")) || []).length;
};

/**
 * Get Elements of a string between a start and end character
 * @method
 * @memberof utils.text
 * @param {String} str - The string to split
 * @param  {Char} startChar - the character to start checking between
 * @param  {Char} endChar - the character to end checking between
 * @returns {Array} - An array of the parts: [before, in, after]
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
 * Convert camelCase to Sentence Case
 * @method
 * @memberof utils.text
 * @param {String} text - The string in camelCase
 * @returns {String} - The new string as a capitalized sentence like "Camel Case"
 */
export const camelCaseToSentence = text => {
  let result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
