package encrypt

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/json"

	"github.com/Kebalepile/movie_info_api/read"
)

func DecodeCipherText(encodedCipherText string) read.Request {
	key := GenerateKey()
	iv := GenerateIV()
	decodedCiphertext, err := base64.StdEncoding.DecodeString(encodedCipherText)
	if err != nil {
		panic(err)
	}
	// Decrypt the data using the encryption key.
	plaintext, err := key.Decrypt(iv, decodedCiphertext)
	if err != nil {
		panic(err)
	}
	var endUserRequest read.Request
	err = json.Unmarshal(plaintext, &endUserRequest)
	if err != nil {
		panic(err)
	}

	return endUserRequest

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

// implements error type that implemetns the error interface
type CustomError struct {
	Message string
}

func (e CustomError) Error() string {
	return e.Message
}

/*
*
@description Encrypt and Encode response data to be sent as json body
*/
func EncryptEncode(data interface{}) (string, error) {
	k := GenerateKey()
	iv := GenerateIV()
	cipherText, err := Encrypt(k, iv, data)

	if err != nil {

		return "", CustomError{Message: "Failed to encrypt data"}
	}
	/**
	 * @description convert byte slice to a base64 string before sending as response body
	 */
	encodedText := base64.StdEncoding.EncodeToString(cipherText)
	return encodedText, nil
}
