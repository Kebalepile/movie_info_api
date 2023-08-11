import { generateKeyFromString, generateIVFromString } from "./generateKey.js";
import { secret } from "./diphiri.js";

/**
 *
 * @param {unit8Array} key
 * @param {unit8Array} iv
 * @param {object} data
 * @description Encrypt some data
 * @returns unit8Array
 */
async function encrypt(key, iv, data) {
  /**
   * @dscription Import the encryption key using crypto.subtle.importKey*/
  let importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // Use the Web Crypto API to encrypt the data with the imported key and IV.
  let encodedData = new TextEncoder().encode(JSON.stringify(data)); // convert text to bytes
  let cipheredData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    importedKey,
    encodedData
  );
  return new Uint8Array(cipheredData); // convert cipheredData to a byte array
}

/**
 *
 * @param {unit8Array} key
 * @param {unit8Array} iv
 * @param {string} cipheredData
 * @returns
 */
async function decrypt(key, iv, cipheredData) {
  // Import the decryption key using crypto.subtle.importKey
  let importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // Use the Web Crypto API to decrypt the cipheredData with the imported key and IV.
  let plainData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    importedKey,
    cipheredData
  );
  let decodedData = new TextDecoder().decode(plainData); // convert plainData to text
  return JSON.parse(decodedData);
}

/**
 *
 * @param {object} data
 * @description encrypt wrapper function
 * @return encrypted data as a base64 string before sending it to the server
 */
export async function Encrypt(data) {
  try {
    const k = await generateKeyFromString(secret.k);
    const iv = generateIVFromString(secret.iv);

    const cipheredData = await encrypt(k, iv, data);
    /**
     * @description convert byte array to a base64 string
     */
    const endcodeCipheredData = btoa(String.fromCharCode(...cipheredData));
    return endcodeCipheredData;
  } catch (err) {
    console.log(err);
  }
}
/**
 *
 * @param {string} encoededCipherData
 * @description decrypt wrapper function
 * @return decrypted data
 */
export async function Decrypt(encodedCipherData) {
  try {
    const k = await generateKeyFromString(secret.k);
    const iv = generateIVFromString(secret.iv);
    const decodedCipherData = new Uint8Array(
      atob(encodedCipherData)
        .split("")
        .map((c) => c.charCodeAt(0))
    );

    const plainData = await decrypt(k, iv, decodedCipherData);
    return plainData;
  } catch (err) {
    console.log(err);
  }
}
