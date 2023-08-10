package ecrypt

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
)

// EncryptionKey represents the encryption key used for encrypting and decrypting data.
type EncryptionKey []byte

func Start() {
	// Generate a shared encryption key.
	key := generateRandomKey()

	// Generate a random initialization vector (IV).
	iv := generateRandomIV()

	// Encrypt some data.
	data := map[string]interface{}{"message": "This is some data to encrypt."}
	ciphertext, err := encrypt(key, iv, data)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Println("ciphered text -> ", ciphertext)

	// Encode the encrypted data as a base64 string before sending it to the API.
	encodedCiphertext := base64.StdEncoding.EncodeToString(ciphertext)
	// fmt.Println("encoded ciphered text -> ", encodedCiphertext)

	// Send the encoded ciphertext to the API.
	// ...

	// On the server side, decode the base64 string back to ciphertext.
	decodedCiphertext, err := base64.StdEncoding.DecodeString(encodedCiphertext)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Println("decoded ciphered text -> ", decodedCiphertext)

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

func generateRandomKey() EncryptionKey {
	key := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		panic(err)
	}
	return EncryptionKey(key)
}

func generateRandomIV() []byte {
	iv := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		panic(err)
	}
	return iv
}

func encrypt(key, iv []byte, data interface{}) ([]byte, error) {
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