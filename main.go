package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
)

func main() {
	// Generate a shared encryption key.
	key := generateRandomKey()

	// Encrypt some data.
	text := "This is some data to encrypt."
	ciphertext, err := encrypt(key, text)
	if err != nil {
		fmt.Println(err)
		return
	}
    fmt.Println("ciphered text -> ", ciphertext)
	// Encode the encrypted data as a base64 string before sending it to the API.
	encodedCiphertext := base64.StdEncoding.EncodeToString(ciphertext)
    fmt.Println("encided ciphered text -> ", encodedCiphertext)
	// Send the encoded ciphertext to the API.
	// ...

	// On the server side, decode the base64 string back to ciphertext.
	decodedCiphertext, err := base64.StdEncoding.DecodeString(encodedCiphertext)
	if err != nil {
		fmt.Println(err)
		return
	}
    fmt.Println("deciphered text -> ", decodedCiphertext)
	// Decrypt the data.
	plaintext, err := decrypt(key, decodedCiphertext)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print the decrypted data.
	fmt.Println("plain text -> ",string(plaintext))
}

func generateRandomKey() []byte{
key := make([]byte, 32)
if _, err := io.ReadFull(rand.Reader, key); err != nil {
	panic(err)
}
return key
}

func encrypt(key []byte, text string) ([]byte, error) {
	// Create a new AES cipher block.
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	// Generate a random initialization vector (IV).
	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, err
	}

	// Perform AES encryption in Galois/Counter Mode (GCM).
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Encrypt the text with the generated IV.
	ciphertext := aesgcm.Seal(nil, iv, []byte(text), nil)

	// Prepend the IV to the ciphertext.
	ciphertext = append(iv, ciphertext...)

	return ciphertext, nil
}

func decrypt(key []byte, ciphertext []byte) ([]byte, error) {
	// Create a new AES cipher block.
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	// Extract the IV from the ciphertext.
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	// Perform AES decryption in Galois/Counter Mode (GCM).
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Decrypt the ciphertext using the extracted IV.
	plaintext, err := aesgcm.Open(nil, iv, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	return plaintext, nil
}