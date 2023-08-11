package encrypt

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/crypto/pbkdf2"
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
	salt := []byte(keys["salt"])
	// choose an appropreate number of iterations
	iterations := 100000
	k := pbkdf2.Key([]byte(keys["k"]), salt, iterations, 32, sha256.New)
	return EncryptionKey(k)
}
func GenerateIV() intializationVector {
	keys := GetKeys()
	iv := []byte(keys["iv"])
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
	err = ioutil.WriteFile(filepath.Join("encrypt", "file", "stuff.json"), contentBytes, 0644)
	if err != nil {
		panic(err)
	}
	fmt.Println(content)
	fmt.Println(contentBytes)
}

func GetKeys() map[string]string {
	var filePaths []string
	fileDir := filepath.Join("encrypt", "file", "keys.json")
	err := filepath.Walk(fileDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && filepath.Ext(path) == ".json" {
			if strings.Contains(info.Name(), "keys") {
				filePaths = append(filePaths, path)
				return nil
			}
			return errors.New("No file  with given name found")
		}
		return errors.New("No json file found")
	})

	if err != nil {
		panic(err)

	}

	fileContentChan := make(chan []byte)

	for _, fname := range filePaths {
		go func(name string) {
			contents, err := ioutil.ReadFile(name)
			if err != nil {
				panic(err)
			}

			fileContentChan <- contents
		}(fname)
	}
	var contents map[string]string
	for range filePaths {

		bytes := <-fileContentChan
		err := json.Unmarshal(bytes, &contents)
		if err != nil {
			panic(err)

		}

	}

	return contents
}
