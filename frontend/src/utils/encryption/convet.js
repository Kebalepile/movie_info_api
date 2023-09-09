/**
 *
 * @param {string} str
 * @desctiption converts unit8Array to string
 * @returns unit8Array
 */
export function stringToUint8Array(str) {
  try {
    let encoder = new TextEncoder();
    return encoder.encode(str);
  } catch (err) {
    console.error(err.message);
  }
}

/**
 *
 * @param {unit8Array} arr
 * @description Convert a Uint8Array to a string
 * @returns  string
 */
export function uint8ArrayToString(arr) {
  try {
    let decoder = new TextDecoder();
    return decoder.decode(arr);
  } catch (err) {
    console.error(err.message);
  }
}
