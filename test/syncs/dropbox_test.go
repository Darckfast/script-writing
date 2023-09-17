package syncs

import (
	"os"
	"strings"
	"testing"

	"script-writing/pkg/logger"
	"script-writing/pkg/saveload"
	"script-writing/pkg/store"
	"script-writing/pkg/syncs"
	"script-writing/pkg/utils"
)

var DBX *syncs.DBXSync

func TestMain(m *testing.M) {
	logger := logger.New()
	defer logger.LogFile.Close()

	saveLoad := saveload.New()
	randomString := utils.GetRandString(32)

	os.Setenv("STORE_ENC_KEY", string(randomString))

	store.Init(saveLoad)
	DBX = syncs.New()

	code := m.Run()

	os.Exit(code)
}

func TestAuthURLGen(t *testing.T) {
	url := DBX.GetAuthURL()

	if !strings.Contains(url, "https") {
		t.Errorf("URL must be created with https, got %s", url)
	}
}
