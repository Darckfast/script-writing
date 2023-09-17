package store

import (
	"encoding/json"
	"os"
	"testing"

	"script-writing/pkg/logger"
	"script-writing/pkg/saveload"
	"script-writing/pkg/store"
	"script-writing/pkg/utils"
)

func TestMain(m *testing.M) {
	logger := logger.New()
	defer logger.LogFile.Close()

	saveLoad := saveload.New()
	randomString := utils.GetRandString(32)

	os.Setenv("STORE_ENC_KEY", string(randomString))

	store.Init(saveLoad)

	code := m.Run()
	os.Exit(code)
}

func TestCreatingNewStore(t *testing.T) {
	content := map[string]any{"a": true, "b": 1, "c": "string"}

	store.SaveStore("test.store", content)

	storedContent := store.LoadStore("test.store")

	var parseStore map[string]any

	json.Unmarshal([]byte(storedContent), &parseStore)

	if parseStore["a"] != content["a"] {
		t.Errorf("Stored value loaded incorrectly, expected %s got %s", content["a"], parseStore["a"])
	}

	if parseStore["b"] != content["b"] {
		t.Errorf("Stored value loaded incorrectly, expected %s got %s", content["b"], parseStore["b"])
	}
}
