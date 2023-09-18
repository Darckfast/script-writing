package saveload

import (
	"encoding/json"
	"errors"
	"io/fs"
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

	if os.Getenv("NODE_ENV") != "production" {
		dir = filepath.Join(dir, "dev")
	}

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

func (*SaveLoad) ExcludeLocal(filenName string) {
	gameStateDir := GetDir()
	filePath := filepath.Join(gameStateDir, filenName)

	err := os.Remove(filePath)
	if err != nil && !errors.Is(err, fs.ErrNotExist) {
		logger.Error.Println("Error while trying to remove", filenName, err)
	}
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
		logger.Error.Println("Error on save ", err)
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
