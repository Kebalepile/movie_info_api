/**
 * 
 * @param {string} str 
 * @desctiption converts unit8Array to string
 * @returns unit8Array 
 */
export function stringToUint8Array(str) {
    let encoder = new TextEncoder();
    return encoder.encode(str);
  }

/**
 * 
 * @param {unit8Array} arr 
 * @description Convert a Uint8Array to a string
 * @returns  string
 */
export function uint8ArrayToString(arr) {
    let decoder = new TextDecoder();
    return decoder.decode(arr);
  }