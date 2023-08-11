export function generateFRString(inputString) {
  const inputLength = inputString.length,
    randomValues = new Uint32Array(inputLength);
  window.crypto.getRandomValues(randomValues);
  let result = "";
  for (let i = 0; i < inputLength; i++) {
    const randonIndex = randomValues[i] % inputLength;
    result += inputString.charAt(randonIndex);
  }

  return result;
}

export function generateRandomID() {
  return window.crypto.randomUUID();
}
