package exporter

import (
	"encoding/json"
	"os"

	"script-writing/pkg/app"
	"script-writing/pkg/logger"
	"script-writing/pkg/saveload"
	"script-writing/pkg/types"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Exporter struct{}

func New() *Exporter {
	return &Exporter{}
}

func (_ *Exporter) ExportBundle() {
	bundle := prepareBundle()
	saveExportFile(bundle)
}

func prepareBundle() *types.Bundle {
	loader := saveload.New()

	storiesString, _ := loader.LoadLocal("stories.json")
	documentsString, _ := loader.LoadLocal("documents.json")

	var stories *types.Stories
	var documents *types.Documents

	json.Unmarshal([]byte(storiesString), &stories)
	json.Unmarshal([]byte(documentsString), &documents)

	bundle := types.Bundle{}

	for _, story := range *stories {
		if !story.ExportOnBundle {
			logger.Info.Printf("Story %s (%s) is not flagged to be exported, ignoring\n", story.Ifid, story.StoryName)

			continue
		}

		singleBundle := bundle.FindByName(story.Group)

		newBundle := false
		if singleBundle == nil {
			newBundle = true
			singleBundle = &types.SingleBundle{
				Name:    story.Group,
				Content: []any{},
			}
		}

		if story.Type == "array" {
			singleBundle.Content = append(singleBundle.Content, story.Passages)
		} else {
			singleBundle.Content = append(singleBundle.Content, story)
		}

		if newBundle {
			bundle = append(bundle, *singleBundle)
		}
	}

	for _, document := range *documents {
		var docContent any

		json.Unmarshal([]byte(document.Content.Text), &docContent)

		bundle = append(bundle, types.SingleBundle{
			Name:    document.Name,
			Content: []any{docContent},
		})
	}

	return &bundle
}

func saveExportFile(bundle *types.Bundle) {
	selectedPath, err := runtime.SaveFileDialog(app.Ctx, runtime.
		SaveDialogOptions{
		Title: "Exporting bundle",
		Filters: []runtime.FileFilter{{
			DisplayName: "JSON",
			Pattern:     "*.json",
		}},
		CanCreateDirectories: true,
		DefaultFilename:      "bundle.json",
	})
	if err != nil {
		logger.Error.Println("Error on selecting path to export", err)

		return
	}

	bundleBytes, _ := json.Marshal(bundle)

	err = os.WriteFile(selectedPath, bundleBytes, os.ModePerm)

	if err != nil {
		logger.Error.Println("Error on saving file", err)
	}
}
