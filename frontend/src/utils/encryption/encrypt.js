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
  try {
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
  } catch (err) {
    console.error(err.message);
  }
}

/**
 *
 * @param {unit8Array} key
 * @param {unit8Array} iv
 * @param {string} cipheredData
 * @returns
 */
async function decrypt(key, iv, cipheredData) {
  try {
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
  } catch (err) {
    console.error(err.message);
  }
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

    const cipheredText = await encrypt(k, iv, data);
    /**
     * @description convert byte array to a base64 string
     */
    const endcodeCipherText = btoa(String.fromCharCode(...cipheredText));
    return endcodeCipherText;
  } catch (err) {
    console.log(err);
  }
}
/**
 *
 * @param {string} encodedCipherText
 * @description decrypt wrapper function
 * @return decrypted data
 */
export async function Decrypt(encodedCipherText) {
  try {
    const k = await generateKeyFromString(secret.k);
    const iv = generateIVFromString(secret.iv);
    const decodedCipherText = new Uint8Array(
      atob(encodedCipherText)
        .split("")
        .map((c) => c.charCodeAt(0))
    );

    const plainData = await decrypt(k, iv, decodedCipherText);
    return plainData;
  } catch (err) {
    console.log(err);
  }
}
