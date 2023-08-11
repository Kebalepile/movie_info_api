
import { Encrypt } from "../../utils/encryption/encrypt.js";
/**
 *
 * @param {string} url - domain being used for fetch
 * @param {object} options - fetch options
 * @returns object data recieved from fetch request
 */
export async function Home(url,options) {
  try {
    const res = await fetch(url, options);
    return await res.json();
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
export async function Trending(url,options) {
  try {
    const res = await fetch(url + "trending", options);

    return await res.json();
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
export async function Recommended(url,options) {
  try {
    const res = await fetch(url + "recommended", options);
    return await res.json();
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
  const encodedCipherText = await Encrypt(data);

  try {
    const res = await fetch(url + "request", {
      method: "POST",
      body: JSON.stringify(encodedCipherText),
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
