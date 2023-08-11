import  home  from "./components/pages/home.js";
// import { Encrypt, Decrypt } from "./utils/encryption/encrypt.js";
// import {  generateRandomID } from "./utils/encryption/random.js";
home();

// Main function.
// async function main() {
//   // Encrypt some data.
//   let data = { name: "keba", age: 26, message: "O top dog." };
//   const encodedCipherData = await Encrypt(data);
//   console.log(encodedCipherData);
//   const plainData = await Decrypt(encodedCipherData);
//   console.log(plainData);

//   // console.log(generateRandomID());
//   // console.log(generateRandomID());
//   // console.log(generateRandomID());
// }

// main();
import {
  Home,
  Request,
  Recommended,
  Trending,
} from "./components/cimaTube/api.js";
import { apiUrl, options } from "./components/cimaTube/url.js";
import { RequestData } from "./components/cimaTube/Request.js";
(async () => {
  let res = await Home(apiUrl, options);
  console.log(res);
  res = await Trending(apiUrl, options);
  console.log(res);
  res = await Recommended(apiUrl, options);
  console.log(res);
  const data = RequestData({
    query: "Kill Bill",
    email: "koko@outlok.com",
    mediaHandle: "@twiter/kokij",
  });
  res = await Request(apiUrl, data);
  console.log(res);
})();
