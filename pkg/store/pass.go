package store

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/json"
	"io"

	"script-writing/pkg/logger"
	"script-writing/pkg/saveload"
	"script-writing/pkg/utils"
)

var (
	sv            *saveload.SaveLoad
	encryptionKey string
)

func Init(saveLoad *saveload.SaveLoad) {
	sv = saveLoad
	encryptionKey = utils.EncryptionKey
}

func SaveStore(storeName string, content any) {
	if sv == nil {
		logger.Error.Println("SaveLoad has not been initialized")
		return
	}

	block, _ := aes.NewCipher([]byte(encryptionKey))
	gcm, _ := cipher.NewGCM(block)

	nonce := make([]byte, gcm.NonceSize())
	io.ReadFull(rand.Reader, nonce)

	contentString, err := json.Marshal(content)
	if err != nil {
		logger.Error.Println("Error while converting store to string", storeName, err)
		return
	}

	cipherContent := gcm.Seal(nonce, nonce, []byte(contentString), nil)

	sv.SaveLocal(storeName, string(cipherContent))
}

func LoadStore(storeName string) string {
	if sv == nil {
		logger.Error.Println("SaveLoad has not been initialized")
		return ""
	}

	if encryptionKey == "" {
		logger.Warn.Println("Encryption key not loaded")
		return ""
	}

	cipherString, _ := sv.LoadLocal(storeName)

	if len(cipherString) <= 2 {
		logger.Warn.Println("Store not found", storeName)
		return ""
	}

	block, _ := aes.NewCipher([]byte(encryptionKey))
	gcm, _ := cipher.NewGCM(block)
	nonce := cipherString[:gcm.NonceSize()]
	cipherText := cipherString[gcm.NonceSize():]
	plainText, err := gcm.Open(nil, []byte(nonce), []byte(cipherText), nil)
	if err != nil {
		logger.Error.Println("Error while decrypting the store", storeName, err)
		return ""
	}

	return string(plainText)
}
