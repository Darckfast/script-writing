package syncs

import (
	"encoding/json"
	"io"
	"script-writing/pkg/logger"
	"strings"

	"github.com/dropbox/dropbox-sdk-go-unofficial/v6/dropbox"
	"github.com/dropbox/dropbox-sdk-go-unofficial/v6/dropbox/files"
	"github.com/dropbox/dropbox-sdk-go-unofficial/v6/dropbox/users"
)

type DBXSync struct{}

type UploadArgs struct {
	FileName    string `json:"fileName"`
	ContentHash string `json:"contentHash"`
	Rev         string `json:"rev"`
	Content     string `json:"content"`
}

type Result struct {
	Content     any    `json:"content,omitempty"`
	ContentHash string `json:"contentHash,omitempty"`
	Rev         string `json:"rev,omitempty"`
	Err         error  `json:"err,omitempty"`
}

func New() *DBXSync {
	return &DBXSync{}
}

var config = dropbox.Config{
	LogLevel: dropbox.LogInfo,
	Token:    "",
}

var fileClient files.Client

func (_ *DBXSync) Auth(authToken string) {
	config.Token = authToken

	fileClient = files.New(config)
	logger.Info.Println("Dropbox authenticated")
}

type MetadataResult struct {
	ContentHash string `json:"contentHash,omitempty"`
	Rev         string `json:"rev,omitempty"`
	Err         error  `json:"err,omitempty"`
}

func (_ *DBXSync) GetMetadata(fileName string) *MetadataResult {
	res, err := fileClient.GetMetadata(&files.GetMetadataArg{
		Path: "/documents.json",
	})

	if err != nil {
		return &MetadataResult{
			Err: err,
		}
	}

	metadata := res.(*files.FileMetadata)

	return &MetadataResult{
		ContentHash: metadata.ContentHash,
		Rev:         metadata.Rev,
	}
}

type UploadResult struct {
	ContentHash string `json:"contentHash,omitempty"`
	Rev         string `json:"rev,omitempty"`
	Err         error  `json:"err,omitempty"`
}

func (_ *DBXSync) IsAuthenticated() bool {
	userClient := users.New(config)

	_, err := userClient.GetCurrentAccount()

	return err == nil
}

func (_ *DBXSync) UploadFile(args UploadArgs) *UploadResult {
	logger.Info.Println("Updating file", args.FileName, args.Rev)

	res, err := fileClient.Upload(&files.UploadArg{
		ContentHash: args.ContentHash,
		CommitInfo: files.CommitInfo{
			Mode: &files.WriteMode{
				// Update: args.Rev,
				Tagged: dropbox.Tagged{Tag: "overwrite"},
			},
			Path: "/" + args.FileName + ".json",
		},
	}, strings.NewReader(args.Content))

	if err != nil {
		logger.Error.Println("Error on upload of", args.FileName, err)

		return &UploadResult{
			Err: err,
		}
	}

	return &UploadResult{
		ContentHash: res.ContentHash,
		Rev:         res.Rev,
	}
}

func (_ *DBXSync) DownloadFile(fileName string) *Result {
	logger.Info.Println("Downloading file", fileName)

	if fileClient == nil {
		logger.Warn.Println("Dropbox need to be authenticated before using it")

		return &Result{}
	}

	res, content, err := fileClient.Download(&files.DownloadArg{
		Path: "/" + fileName + ".json",
	})

	contentBytes := []byte{}
	var object any

	if err != nil {
		logger.Error.Println("Error on download of file", fileName, err)
	}

	if content != nil {
		defer content.Close()
		contentBytes, _ = io.ReadAll(content)
		json.Unmarshal(contentBytes, &object)
	}

	rev := ""
	contentHash := ""

	if res != nil {
		rev = res.Rev
		contentHash = res.ContentHash
	}

	return &Result{
		Content:     object,
		ContentHash: contentHash,
		Rev:         rev,
		Err:         err,
	}
}
