import home from "./components/pages/home.js";
home();

// Generate a shared encryption key.
async function generateRandomKey() {
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

// Generate a random initialization vector (IV).
function generateRandomIV() {
  // Use the Web Crypto API to generate a random 12-byte IV for AES-GCM.
  let iv = new Uint8Array(12); // 12 bytes
  window.crypto.getRandomValues(iv);
  return iv;
}
// Convert a string to a Uint8Array.
function stringToUint8Array(str) {
  let encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert a Uint8Array to a string.
function uint8ArrayToString(arr) {
  let decoder = new TextDecoder();
  return decoder.decode(arr);
}

// Derive an encryption key from a string using PBKDF2.
async function generateKeyFromString(keyString) {
  let salt = stringToUint8Array("some-salt-value"); // Choose a fixed salt value or generate one based on your needs
  let iterations = 100000; // Choose an appropriate number of iterations

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

// Generate an initialization vector (IV) from a string.
function generateIVFromString(ivString) {
  let iv = stringToUint8Array(ivString);
  if (iv.length > 12) {
    iv = iv.subarray(0, 12); // Truncate the IV to 12 bytes if it's longer
  } else if (iv.length < 12) {
    let padding = new Uint8Array(12 - iv.length); // Pad the IV with zero bytes if it's shorter
    iv = new Uint8Array([...iv, ...padding]);
  }
  return iv;
}
// Encrypt some data.
// Encrypt some data.
async function encrypt(key, iv, text) {
  // Import the encryption key using crypto.subtle.importKey
  let importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // Use the Web Crypto API to encrypt the text with the imported key and IV.
  let encodedText = new TextEncoder().encode(JSON.stringify(text)); // convert text to bytes
  let ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    importedKey,
    encodedText
  );
  return new Uint8Array(ciphertext); // convert ciphertext to a byte array
}

// Decrypt some data.
// Decrypt some data.
async function decrypt(key, iv, ciphertext) {
  // Import the decryption key using crypto.subtle.importKey
  let importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // Use the Web Crypto API to decrypt the ciphertext with the imported key and IV.
  let plaintext = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    importedKey,
    ciphertext
  );
  let decodedText = new TextDecoder().decode(plaintext); // convert plaintext to text
  return JSON.parse(decodedText);
}

// Main function.
async function main() {
  // Generate a shared encryption key.
  let key = await generateKeyFromString("keba");
  

  // Generate a random initialization vector (IV).
  let iv =generateIVFromString("keba");
  console.log(key);
  console.log("i vector")
  console.log(iv);

  // Encrypt some data.
  let text = { name: "keba", age: 26 , message: "O top dog." };
  let ciphertext = await encrypt(key, iv, text);
  // console.log("ciphered text -> ", ciphertext);

  // Encode the encrypted data as a base64 string before sending it to the API.
  let encodedCiphertext = btoa(String.fromCharCode(...ciphertext)); // convert byte array to a base64 string
  console.log("encoded ciphered text -> ");
  console.log(encodedCiphertext)

  // Send the encoded ciphertext to the API.
  // ...

  // On the server side, decode the base64 string back to ciphertext.
  let decodedCiphertext = new Uint8Array(
    atob(encodedCiphertext)
      .split("")
      .map((c) => c.charCodeAt(0))
  ); // convert base64 string to a byte array
  // console.log("decoded ciphered text -> ", decodedCiphertext);

  // Decrypt the data.
  let plaintext = await decrypt(key, iv, decodedCiphertext);
  console.log(plaintext);
}

main();
