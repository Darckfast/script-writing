package saveload

import (
	"os"
	"script-writing/pkg/logger"
	"testing"
)

var saveLoad *SaveLoad

func TestMain(m *testing.M) {
	saveLoad = New()
	logger := logger.New()

	code := m.Run()

	logger.LogFile.Close()

	os.Exit(code)
}

func TestShouldCreateGameDir(t *testing.T) {
	gameDir := GetDir()

	if gameDir == "" {
		t.Errorf("Game dir must be created if does not already exists")
	}
}

func TestShouldCreateFileOnLoadIfNotExist(t *testing.T) {
	fileContent, err := saveLoad.LoadLocal("test.load")

	if err != nil {
		t.Errorf("Must not return error, %s", err)
	}

	if fileContent != "[]" {
		t.Errorf("It must be initialized as empty array, got %s", fileContent)
	}
}

func TestMustSaveToLocalFile(t *testing.T) {
	content := `[{"a":true}]`

	saveLoad.SaveLocal("test.save", content)

	defaultDir = GetDir()

	fileBytes, _ := os.ReadFile(defaultDir + "/test.save")
	savedFileContent := string(fileBytes)

	if savedFileContent != content {
		t.Errorf("Local file content must be the same, got %s expected %s", savedFileContent, content)
	}
}

func TestLoadMustReturnSavedFile(t *testing.T) {
	content := `[{"b":true}]`

	saveLoad.SaveLocal("test.save", content)

	savedFile, _ := saveLoad.LoadLocal("test.save")

	if savedFile != content {
		t.Errorf("Load local must return the saved file, got %s expected %s", savedFile, content)
	}
}
