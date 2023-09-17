package saveload

import (
	"encoding/json"
	"os"
	"path/filepath"

	"script-writing/pkg/logger"
)

type SaveLoad struct{}

var defaultDir string

func New() *SaveLoad {
	return &SaveLoad{}
}

func GetDir() string {
	cacheDir, _ := os.UserCacheDir()
	dir := filepath.Join(cacheDir, "script-writing", "gameState")

	_, err := os.Stat(dir)

	if os.IsNotExist(err) {
		logger.Info.Println("Creating 'gameState' dir on ", cacheDir)

		os.MkdirAll(dir, os.ModePerm)
	}

	defaultDir = dir

	return defaultDir
}

func (sv *SaveLoad) SaveAnyLocal(fileName string, source any) {
	sourceJsonBytes, _ := json.Marshal(source)
	sv.SaveLocal(fileName, string(sourceJsonBytes))
}

func (_ *SaveLoad) SaveLocal(fileName, fileContent string) {
	if fileName == "" || fileContent == "" {
		logger.Warn.Println("Attempt to write empty file", fileName)

		return
	}

	gameStateDir := GetDir()
	filePath := filepath.Join(gameStateDir, fileName)

	err := os.WriteFile(filePath, []byte(fileContent), os.ModePerm)
	if err != nil {
		logger.Error.Fatal("Error on save ", err)
	}
}

func (local *SaveLoad) LoadLocal(fileName string) (string, error) {
	if fileName == "" {
		logger.Warn.Println("Attempt to read with empty file name")

		return "", nil
	}

	gameStateDir := GetDir()
	filePath := filepath.Join(gameStateDir, fileName)
	fileBytes, err := os.ReadFile(filePath)

	if err == nil {
		return string(fileBytes), nil
	}

	if os.IsNotExist(err) {
		local.SaveLocal(fileName, "[]")

		return "[]", nil
	}

	logger.Error.Fatal("Error on load ", err)

	return "", err
}
