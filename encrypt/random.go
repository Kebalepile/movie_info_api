package encrypt

import (
	"crypto/rand"
	"crypto/sha256"
	"golang.org/x/crypto/pbkdf2"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"path/filepath"
)

// EncryptionKey represents the encryption key used for encrypting and decrypting data.
type EncryptionKey []byte
type intializationVector []byte

func GenerateRandomKey() EncryptionKey {
	key := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		panic(err)
	}
	return EncryptionKey(key)
}

// Generate a random initialization vector (IV).
func GenerateRandomIV() intializationVector {
	iv := intializationVector(make([]byte, 12))
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		panic(err)
	}
	return iv
}
func GenerateRandomKeyFromString(key string) (EncryptionKey, error) {
	// choose a fixed salt value or generate on based on your needs
	salt := []byte("some-salt-value")
	// choose an appropreate number of iterations
	iterations := 100000 
	k := pbkdf2.Key([]byte(key), salt, iterations, 32, sha256.New)
	return EncryptionKey(k), nil
}
func GenerateIVFromString(ivString string) intializationVector {
	iv := []byte(ivString)
	if len(iv) > 12 {
		//Truncate the iv slice to 12 bytes if it is longer
		iv = iv[:12]
	} else if len(iv) < 12 {
		// Pad the iv sclice with zero bytes if it is shorter
		padding := make([]byte, 12 - len(iv))
		iv = append(iv, padding...)
	}
	return intializationVector(iv)
}
func SaveKeys(key EncryptionKey, iv intializationVector) {
	content := map[string]interface{}{
		"randomKey": key,
		"iVector":   iv,
	}
	contentBytes, err := json.Marshal(content)
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile(filepath.Join("encrypt", "random", "keys.json"), contentBytes, 0644)
	if err != nil {
		panic(err)
	}
	fmt.Println(content)
	fmt.Println(contentBytes)
}
