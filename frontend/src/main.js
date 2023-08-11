import home from "./components/pages/home.js";
import { Encrypt, Decrypt } from "./utils/encryption/encrypt.js";
// import {  generateRandomID } from "./utils/encryption/random.js";
home();

// Main function.
async function main() {
  // Encrypt some data.
  let data = { name: "keba", age: 26, message: "O top dog." };
  const encodedCipherData = await Encrypt(data);
  console.log(encodedCipherData);
  const plainData = await Decrypt(encodedCipherData);
  console.log(plainData);

  // console.log(generateRandomID());
  // console.log(generateRandomID());
  // console.log(generateRandomID());
}

main();
