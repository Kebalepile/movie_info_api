

/**
 *
 * @param {string} url - domain being used for fetch
 * @param {object} options - fetch options
 * @returns object data recieved from fetch request
 */
export async function home(url,options) {
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
export async function trending(url,options) {
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
export async function recommended(url,options) {
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
export async function request(url, data) {
  try {
    const res = await fetch(url + "request", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
