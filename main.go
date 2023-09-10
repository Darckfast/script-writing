package main

import (
	"embed"
	"script-writing/pkg/app"
	"script-writing/pkg/exporter"
	"script-writing/pkg/logger"
	"script-writing/pkg/saveload"
	"script-writing/pkg/syncs"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := app.New()

	saveLoad := saveload.New()
	logger := logger.New()
	dbxSync := syncs.New()
	exporter := exporter.New()

	defer logger.LogFile.Close()

	wails.Run(&options.App{
		Title:  "script-writing",
		Width:  1024,
		Height: 768,
		Logger: logger,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.Startup,
		Bind: []any{
			saveLoad,
			dbxSync,
			exporter,
		},
	})
}
