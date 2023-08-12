import { Encrypt, Decrypt } from "../../utils/encryption/encrypt.js";
/**
 *
 * @param {string} url - domain being used for fetch
 * @param {object} options - fetch options
 * @returns object data recieved from fetch request
 */
export async function Home(url, options) {
  try {
    const encodedCipherText = await fetch(url, options);
    const res = await Decrypt(await encodedCipherText.json());
    return res;
  } catch (err) {
    console.log(err);
  }
}
/**
 *
 * @param {string} url - domain being used for fetch
 * @param {object} options - fetch options
 * @returns object data recieved from fetch request
 */
export async function Trending(url, options) {
  try {
    const encodedCipherText = await fetch(url + "trending", options);

    const res = await Decrypt(await encodedCipherText.json());
    return res;
  } catch (err) {
    console.log(err);
  }
}
/**
 *
 * @param {string} url - domain being used for fetch
 * @param {object} options - fetch options
 * @returns object data recieved from fetch request
 */
export async function Recommended(url, options) {
  try {
    const encodedCipherText = await fetch(url + "recommended", options);
    const res = await Decrypt(await encodedCipherText.json());
    return res;
  } catch (err) {
    console.log(err);
  }
}
/**
 *
 * @param {string} url - domain being used for fetch
 * @param {object} data - data being sent to fetch url
 * @returns object data recieved from fetch request
 */
export async function Request(url, data) {
  let encodedCipherText = await Encrypt(data);

  try {
    encodedCipherText = await fetch(url + "request", {
      method: "POST",
      body: JSON.stringify(encodedCipherText),
    });

    const res = await Decrypt(await encodedCipherText.json());
    return res;
  } catch (err) {
    console.log(err);
  }
}
