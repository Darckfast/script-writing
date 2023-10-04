package utils

import (
	"os"

	"github.com/joho/godotenv"
)

var (
	NodeEnv       string
	EncryptionKey string
	DbxClientId   string
)

func Init() {
	if NodeEnv == "" {
		godotenv.Load("frontend/.env")

		NodeEnv = os.Getenv("NODE_ENV")
		EncryptionKey = os.Getenv("STORE_ENC_KEY")
		DbxClientId = os.Getenv("DBX_CLIENT_ID")
	}
}
