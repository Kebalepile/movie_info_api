package encrypt

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/json"
	
	"fmt"
	"io"
	
	"os"
	"path/filepath"
	

	"golang.org/x/crypto/pbkdf2"
	"github.com/Kebalepile/movie_info_api/environment"
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
func GenerateKey() EncryptionKey {
	keys := GetKeys()
	// choose a fixed salt value or generate on based on your needs
	salt := []byte(keys["SALT"])
	// choose an appropreate number of iterations
	iterations := 100000
	k := pbkdf2.Key([]byte(keys["K"]), salt, iterations, 32, sha256.New)
	return EncryptionKey(k)
}
func GenerateIV() intializationVector {
	keys := GetKeys()
	iv := []byte(keys["IV"])
	if len(iv) > 12 {
		//Truncate the iv slice to 12 bytes if it is longer
		iv = iv[:12]
	} else if len(iv) < 12 {
		// Pad the iv sclice with zero bytes if it is shorter
		padding := make([]byte, 12-len(iv))
		iv = append(iv, padding...)
	}
	return intializationVector(iv)
}
func GenerateRandomKeyFromString(key string) (EncryptionKey, error) {
	// choose a fixed salt value or generate on based on your needs
	keys := GetKeys()
	salt := []byte(keys["SALT"])
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
		padding := make([]byte, 12-len(iv))
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
	err = os.WriteFile(filepath.Join("encrypt", "file", "stuff.json"), contentBytes, 0644)
	if err != nil {
		panic(err)
	}
	fmt.Println(content)
	fmt.Println(contentBytes)
}

func GetKeys() map[string]string {
	variables := environment.Read()
	return variables
}
