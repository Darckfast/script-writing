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

	saveLoad.ExcludeLocal("dbx.store")

	code := m.Run()
	os.Exit(code)
}

type StoreType struct {
	A bool   `json:"a"`
	B int    `json:"b"`
	C string `json:"c"`
}

func TestCreatingNewStore(t *testing.T) {
	content := StoreType{A: true, B: 1, C: "string"}

	randStoreName := string(utils.GetRandString(5)) + ".store"
	store.SaveStore(randStoreName, content)

	storedContent := store.LoadStore(randStoreName)

	var parseStore StoreType

	json.Unmarshal([]byte(storedContent), &parseStore)

	if parseStore.A != content.A {
		t.Errorf("Stored value loaded incorrectly, expected %t got %t", content.A, parseStore.A)
	}

	if parseStore.B != content.B {
		t.Errorf("Stored value loaded incorrectly, expected %d got %d", content.B, parseStore.B)
	}
}
