package app

import "context"

var Ctx context.Context

type App struct{}

func New() *App {
	return &App{}
}

func (_ *App) Startup(ctx context.Context) {
	Ctx = ctx
}
