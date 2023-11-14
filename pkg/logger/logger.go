package logger

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
)

var (
	Info  *log.Logger
	Error *log.Logger
	Warn  *log.Logger
)

type CustomLogger struct {
	LogFile *os.File
}

var (
	colorReset = string("\033[0m")
	bgRed      = string("\033[101m")
	bgYellow   = string("\033[103m")
	bgBlue     = string("\033[104m")
	textColor  = string("\033[30m")
	bold       = string("\033[1m")
)

func New() *CustomLogger {
	cacheDir, _ := os.UserCacheDir()
	logDir := filepath.Join(cacheDir, "script-writing", "logs.txt")

	logFile, err := os.OpenFile(logDir, os.O_APPEND|os.O_CREATE|os.O_WRONLY, os.ModePerm)

	writer := io.MultiWriter(logFile, os.Stdout)

	if err != nil {
		fmt.Println(err)
		writer = os.Stdout
	}

	Info = log.New(writer, bgBlue+textColor+bold+" INFO "+colorReset+" ", log.Ldate|log.Ltime)
	Warn = log.New(writer, bgYellow+textColor+bold+" WARN "+colorReset+" ", log.Ldate|log.Ltime)
	Error = log.New(writer, bgRed+textColor+bold+" ERROR "+colorReset+" ", log.Ldate|log.Ltime)

	return &CustomLogger{
		LogFile: logFile,
	}
}

func (_ *CustomLogger) Print(message string) {
	Info.Println(message)
}

func (_ *CustomLogger) Trace(message string) {}

func (_ *CustomLogger) Debug(message string) {}

func (_ *CustomLogger) Info(message string) {
	Info.Println(message)
}

func (_ *CustomLogger) Warning(message string) {
	Warn.Println(message)
}

func (_ *CustomLogger) Error(message string) {
	Error.Println(message)
}

func (_ *CustomLogger) Fatal(message string) {
	Error.Println(message)
	os.Exit(1)
}
