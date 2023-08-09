// import home from "./components/pages/home.js";

// home();
const pubKey = {"N":"24290654426753282898622534206483624118603314092288182103955063410601179294312504462284905222413035801200516892004088969914987257028686167918558485803500170878263681243474207811622938123245522594473046992345376907434618392961496889677188309774717583841960444636408273580731194889725650601555325598249903155027036250329155631343874090601289119872472763124795474023564155714511398913645555145054011148208300284691542870951330672812025833677855009791168984506525808632338263289762703097028380402291952034159015612684335865411976555118364950379829292341912153408699435383996476397820449532910757161493482697362956651925671","E":"65537"}

let N = BigInt(pubKey.N)
let E =BigInt(pubKey.E)

console.log(N)

console.log(E)
// Generate a shared encryption key.
async function generateRandomKey() {
  // Use the Web Crypto API to generate a random 32-byte key for AES-GCM.
  let key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // 32 bytes
    },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] // key can be used to encrypt and decrypt
  );
  return key;
}

// Generate a random initialization vector (IV).
function generateRandomIV() {
  // Use the Web Crypto API to generate a random 12-byte IV for AES-GCM.
  let iv = new Uint8Array(12); // 12 bytes
  window.crypto.getRandomValues(iv);
  return iv;
}

// Encrypt some data.
async function encrypt(key, iv, text) {
  // Use the Web Crypto API to encrypt the text with the provided key and IV.
  let ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    new TextEncoder().encode(text) // convert text to bytes
  );
  return new Uint8Array(ciphertext); // convert ciphertext to byte array
}

// Decrypt some data.
async function decrypt(key, iv, ciphertext) {
  // Use the Web Crypto API to decrypt the ciphertext with the provided key and IV.
  let plaintext = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext // assume ciphertext is a byte array
  );
  return new TextDecoder().decode(plaintext); // convert plaintext to text
}

// Main function.
async function main() {
  // Generate a shared encryption key.
  let key = await generateRandomKey();

  // Generate a random initialization vector (IV).
  let iv = generateRandomIV();
  console.log(key);
  console.log(iv);

  // Encrypt some data.
  let text = "This is some data to encrypt.";
  let ciphertext = await encrypt(key, iv, text);
  // console.log("ciphered text -> ", ciphertext);

  // Encode the encrypted data as a base64 string before sending it to the API.
  let encodedCiphertext = btoa(String.fromCharCode(...ciphertext)); // convert byte array to base64 string
  // console.log("encoded ciphered text -> ", encodedCiphertext);

  // Send the encoded ciphertext to the API.
  // ...

  // On the server side, decode the base64 string back to ciphertext.
  let decodedCiphertext = Uint8Array.from(atob(encodedCiphertext), (c) =>
    c.charCodeAt(0)
  ); // convert base64 string to byte array
  // console.log("decoded ciphered text -> ", decodedCiphertext);

  // Decrypt the data.
  let plaintext = await decrypt(key, iv, decodedCiphertext);
  //  console.log(plaintext)
}

main();
