package encrypt

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/json"
	"fmt"
)

func Start() {

	key := GenerateKey()
	iv := GenerateIV()

	// GET encodedCiphered data from api request
	encodedCiphertext := "frc7uRdEGh4o7lpERL9IzOC3eDd6mTarHA9pLRoYFzZtakwS3qNhHzUkoa54xyRZJaMJ3AZcM2vt26TVH3+x"

	// On the server side, decode the base64 string back to ciphertext.
	decodedCiphertext, err := base64.StdEncoding.DecodeString(encodedCiphertext)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("decoded ciphered text -> ", decodedCiphertext)

	// Decrypt the data using the encryption key.
	plaintext, err := key.Decrypt(iv, decodedCiphertext)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print the decrypted data.
	fmt.Println("plaintext -> ", string(plaintext))
}

func (key EncryptionKey) Decrypt(iv, ciphertext []byte) ([]byte, error) {
	// Create a new AES cipher block.
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	// Perform AES decryption in Galois/Counter Mode (GCM).
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Decrypt the ciphertext using the provided IV.
	plaintext, err := aesgcm.Open(nil, iv, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	return plaintext, nil
}

func Encrypt(key, iv []byte, data interface{}) ([]byte, error) {
	// Serialize the data to JSON.
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	// Create a new AES cipher block.
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	// Perform AES encryption in Galois/Counter Mode (GCM).
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Encrypt the JSON data with the provided IV.
	ciphertext := aesgcm.Seal(nil, iv, jsonData, nil)

	return ciphertext, nil
}
