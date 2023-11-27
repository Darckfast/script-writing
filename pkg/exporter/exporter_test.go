package exporter

import (
	"os"
	"testing"

	"script-writing/pkg/logger"
	"script-writing/pkg/saveload"
)

func TestMain(m *testing.M) {
	logger := logger.New()
	defer logger.LogFile.Close()

	code := m.Run()

	os.Exit(code)
}

func TestPrepareBundle(t *testing.T) {
	saveload.New().SaveLocal("documents.json", `[{"content":{"text":""},"name":"test"}]`)

	bundle := prepareBundle()

	if bundle == nil {
		t.Errorf("Bundle must not be nil")
	}

	singleBundle := bundle.FindByName("test")

	if singleBundle == nil {
		t.Errorf("Single bundle must not be nil")
	}

	if singleBundle.Name != "test" {
		t.Errorf("Single bundle name must be 'test'")
	}
}
