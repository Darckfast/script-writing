package syncs

import (
	"os"
	"strings"
	"testing"

	"script-writing/pkg/logger"
	"script-writing/pkg/syncs"
)

var DBX *syncs.DBXSync

func TestMain(m *testing.M) {
	DBX = syncs.New()
	logger := logger.New()

	defer logger.LogFile.Close()

	code := m.Run()

	os.Exit(code)
}

func TestAuthURLGen(t *testing.T) {
	url := DBX.GetAuthURL()

	if !strings.Contains(url, "https") {
		t.Errorf("URL must be created with https, got %s", url)
	}
}
