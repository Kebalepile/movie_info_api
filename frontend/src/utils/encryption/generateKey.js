import { stringToUint8Array, uint8ArrayToString } from "./convet.js";
import { secret } from "./diphiri.js";
/**
 *
 * @param {string} keyString
 * @description Derive an encryption key from a string using PBKDF2.
 * @returns unit8Array
 */
export async function generateKeyFromString(keyString) {
  let salt = stringToUint8Array(secret.salt); // Choose a fixed salt value or generate one based on your needs
  let iterations = secret.iteration; // Choose an appropriate number of iterations

  let importedKey = await crypto.subtle.importKey(
    "raw",
    stringToUint8Array(keyString),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  let key = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: iterations,
      hash: "SHA-256",
    },
    importedKey,
    256 // 256 bits (32 bytes)
  );

  return new Uint8Array(key);
}
/**
 *
 * @param {string} ivString
 * @description  Generate an initialization vector (IV) from a string.
 * @returns unit8Array
 */
export function generateIVFromString(ivString) {
  let iv = stringToUint8Array(ivString);
  if (iv.length > 12) {
    iv = iv.subarray(0, 12); // Truncate the IV to 12 bytes if it's longer
  } else if (iv.length < 12) {
    let padding = new Uint8Array(12 - iv.length); // Pad the IV with zero bytes if it's shorter
    iv = new Uint8Array([...iv, ...padding]);
  }
  return iv;
}

/**
 * @description Generate a shared encryption key.
 * @return unit8Array
 */
export async function generateRandomKey() {
  // Use the Web Crypto API to generate a random 32-byte key for AES-GCM.
  let key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // 32 bytes
    },
    true, // whether the key is extractable (i.e., can be used in exportKey)
    ["encrypt", "decrypt"] // key can be used to encrypt and decrypt
  );
  return key;
}

/**
 * @description Generate a random initialization vector (IV)
 * @returns unit8Array
 */
export function generateRandomIV() {
  // Use the Web Crypto API to generate a random 12-byte IV for AES-GCM.
  let iv = new Uint8Array(12); // 12 bytes
  window.crypto.getRandomValues(iv);
  return iv;
}
