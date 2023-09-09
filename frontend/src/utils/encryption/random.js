export function generateFRString(inputString) {
  try {
    const inputLength = inputString.length,
      randomValues = new Uint32Array(inputLength);
    window.crypto.getRandomValues(randomValues);
    let result = "";
    for (let i = 0; i < inputLength; i++) {
      const randonIndex = randomValues[i] % inputLength;
      result += inputString.charAt(randonIndex);
    }

    return result;
  } catch (err) {
    console.error(err.message);
  }
}

export function generateRandomID() {
  try {
    return window.crypto.randomUUID();
  } catch (err) {
    console.error(err.message);
  }
}
