package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	// "os"
	"path/filepath"
)


func main() {
	// Generate a shared encryption key.
	key := generateRandomKey()

	// Generate a random initialization vector (IV).
	iv := generateRandomIV()

	// Encrypt some data.
	text := "This is some data to encrypt."
	ciphertext, err := encrypt(key, iv, text)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("ciphered text -> ", ciphertext)

	// Generate a public-private key pair on the server side.
	serverPrivateKey, serverPublicKey, err := generateKeyPair()
	if err != nil {
		fmt.Println(err)
		return
	}
fmt.Println("serverPriveteKey -> ",serverPrivateKey)
fmt.Println("serverPublicKey -> ",serverPublicKey)

	// Send the public key to the client.
	clientPublicKey := serverPublicKey
    fmt.Println("clientPubKey -> ", clientPublicKey)
	// Encode the public key as a JSON object.
public_key, err := json.Marshal(clientPublicKey)

// Convert the JSON object to a string.
publicKeyString := string(public_key)

// Print the JSON string.
fmt.Println(publicKeyString)
file_path := filepath.Join("files",  "1.json")

err = ioutil.WriteFile(file_path, public_key, 0644)
	if err != nil {

		panic(err)
	}
if err != nil {
    fmt.Println(err)
    return
}



	// Use the public key to encrypt the key and the IV on the client side.
	keyAndIV := append(key, iv...)
	keyAndIVCipher, err := rsaEncrypt(clientPublicKey, keyAndIV)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Send the encrypted key and IV to the server.
	serverKeyAndIVCipher := keyAndIVCipher

	// Use the private key to decrypt the key and the IV on the server side.
	serverKeyAndIV, err := rsaDecrypt(serverPrivateKey, serverKeyAndIVCipher)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Extract the key and the IV from the decrypted data.
	serverKey := serverKeyAndIV[:32]
	serverIV := serverKeyAndIV[32:]

	// Decrypt the data using the decrypted key and IV.
	serverPlaintext, err := decrypt(serverKey, serverIV, ciphertext)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print the decrypted data.
	fmt.Println("plaintext -> ", string(serverPlaintext))
}

func generateRandomKey() []byte {
	key := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		panic(err)
	}
	return key
}

func generateRandomIV() []byte {
    // Change the nonce size from 16 to 12 bytes.
    // Alternatively, use NewGCMWithNonceSize to create a GCM instance with a custom nonce size.
    // However, this is not recommended as it may reduce security and compatibility.
    iv := make([]byte, 12) 
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		panic(err)
	}
	return iv
}

func encrypt(key, iv []byte, text string) ([]byte, error) {
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

    // Encrypt the text with the provided IV.
	ciphertext := aesgcm.Seal(nil, iv, []byte(text), nil)

	return ciphertext, nil
}

func decrypt(key, iv, ciphertext []byte) ([]byte, error) {
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

func generateKeyPair() (*rsa.PrivateKey, *rsa.PublicKey, error) {
    // Generate a 2048-bit RSA private key using crypto/rand as source of randomness.
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
        return nil, nil ,err
    }

    // Extract the public key from the private key.
	publicKey := &privateKey.PublicKey

	return privateKey , publicKey ,nil
}

func rsaEncrypt(publicKey *rsa.PublicKey , plaintext []byte) ([]byte , error) {
    // Encrypt plaintext using RSA-OAEP with SHA-256 as hash function and crypto/rand as source of randomness.
	ciphertext, err := rsa.EncryptOAEP(sha256.New(), rand.Reader, publicKey, plaintext, nil)
	if err != nil {
        return nil, err
    }

	return ciphertext, nil
}

func rsaDecrypt(privateKey *rsa.PrivateKey , ciphertext []byte) ([]byte , error) {
    // Decrypt ciphertext using RSA-OAEP with SHA-256 as hash function and crypto/rand as source of randomness.
	plaintext, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, privateKey, ciphertext, nil)
	if err != nil {
        return nil, err
    }

	return plaintext, nil
}
