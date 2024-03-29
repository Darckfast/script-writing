package main

import (
	"embed"

	"script-writing/pkg/app"
	"script-writing/pkg/exporter"
	"script-writing/pkg/logger"
	"script-writing/pkg/saveload"
	"script-writing/pkg/store"
	"script-writing/pkg/syncs"
	"script-writing/pkg/utils"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	utils.Init()

	app := app.New()

	logger := logger.New()
	defer logger.LogFile.Close()

	saveLoad := saveload.New()
	store.Init(saveLoad)

	dbxSync := syncs.New()
	exporter := exporter.New()

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
