package syncs

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"

	"script-writing/pkg/app"
	"script-writing/pkg/logger"
	"script-writing/pkg/store"
	"script-writing/pkg/utils"

	"github.com/dropbox/dropbox-sdk-go-unofficial/v6/dropbox"
	"github.com/dropbox/dropbox-sdk-go-unofficial/v6/dropbox/files"
	"github.com/dropbox/dropbox-sdk-go-unofficial/v6/dropbox/users"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/oauth2"
)

type DBXSync struct {
	codeVerifier string
}

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

var fileConf = dropbox.Config{
	LogLevel: dropbox.LogInfo,
}

var oauthConf = &oauth2.Config{
	Scopes: []string{
		"files.content.write",
		"files.content.read",
	},
	Endpoint: oauth2.Endpoint{
		TokenURL: "https://api.dropboxapi.com/oauth2/token",
		AuthURL:  "https://www.dropbox.com/oauth2/authorize",
	},
}

func New() *DBXSync {
	oauthConf.ClientID = utils.DbxClientId

	var storeToken *oauth2.Token

	contentString := store.LoadStore("dbx.store")

	if contentString != "" {
		err := json.Unmarshal([]byte(contentString), &storeToken)

		if err != nil {
			logger.Error.Println("Error loading local store dbx", err)
		} else {
			logger.Info.Println("Loaded session locally")
			// TODO: add renew session here ? maybe
			sessionToken = storeToken

			fileConf.Token = sessionToken.AccessToken
			fileClient = files.New(fileConf)
			logger.Info.Println("Dropbox authenticated on account", sessionToken.Extra("account_id"))
		}
	}

	return &DBXSync{}
}

var (
	fileClient   files.Client
	sessionToken *oauth2.Token
)

func (dbx *DBXSync) GetAuthURL() string {
	logger.Info.Println("env", utils.NodeEnv)

	randBytes := utils.GetRandString(64)

	hasher := sha256.New()
	hasher.Write(randBytes)
	hashBytes := hasher.Sum(nil)
	hashString := fmt.Sprintf("%x", hashBytes)

	codeChallenge := base64.RawURLEncoding.EncodeToString([]byte(hashString))

	url := oauthConf.AuthCodeURL("",
		oauth2.AccessTypeOffline,
		oauth2.SetAuthURLParam("code_challange_method", "S256"),
		oauth2.SetAuthURLParam("code_challenge", codeChallenge),
	)

	dbx.codeVerifier = codeChallenge

	return url
}

type AuthResult struct {
	Err error `json:"err,omitempty"`
}

// TODO: add refresh otoken on 401
func (dbx *DBXSync) Auth(authToken string) *AuthResult {
	sessionToken, err := oauthConf.Exchange(app.Ctx, authToken,
		oauth2.SetAuthURLParam("code_verifier", dbx.codeVerifier),
		oauth2.SetAuthURLParam("grant_type", "authorization_code"),
	)
	if err != nil {
		logger.Error.Println("Error while retriving the dropbox token", err, dbx.codeVerifier)
		return &AuthResult{
			Err: err,
		}
	}

	store.SaveStore("dbx.store", sessionToken)
	fileConf.Token = sessionToken.AccessToken

	fileClient = files.New(fileConf)

	logger.Info.Println("Dropbox authenticated on account", sessionToken.Extra("account_id"))

	return &AuthResult{}
}

type MetadataResult struct {
	ContentHash string `json:"contentHash,omitempty"`
	Rev         string `json:"rev,omitempty"`
	Err         error  `json:"err,omitempty"`
}

func (*DBXSync) GetMetadata(fileName string) *MetadataResult {
	uploadFileName := GetFileName(fileName)

	res, err := fileClient.GetMetadata(&files.GetMetadataArg{
		Path: "/" + uploadFileName + ".json",
	})
	if err != nil {
		if strings.Contains(err.Error(), "not_found") {
			return &MetadataResult{}
		}

		logger.Error.Println("Error getting the metadata of", fileName, err)
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

func (*DBXSync) IsAuthenticated() bool {
	userClient := users.New(fileConf)

	_, err := userClient.GetCurrentAccount()

	return err == nil
}

func GetFileName(fileName string) string {
	uploadFileName := fileName

	logger.Info.Println("env", utils.NodeEnv)
	env := utils.NodeEnv

	if env == "development" {
		uploadFileName = "dev/" + uploadFileName
	}

	return uploadFileName
}

func (*DBXSync) UploadFile(args UploadArgs) *UploadResult {
	logger.Info.Println("Updating file", args.FileName, args.Rev)

	uploadFileName := GetFileName(args.FileName)

	res, err := fileClient.Upload(&files.UploadArg{
		ContentHash: args.ContentHash,
		CommitInfo: files.CommitInfo{
			Mode: &files.WriteMode{
				// Update: args.Rev,
				Tagged: dropbox.Tagged{Tag: "overwrite"},
			},
			Path: "/" + uploadFileName + ".json",
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

func (*DBXSync) DownloadFile(fileName string) *Result {
	logger.Info.Println("Downloading file", fileName)

	if fileClient == nil {
		logger.Warn.Println("Dropbox need to be authenticated before using it")

		return &Result{}
	}
	uploadFileName := GetFileName(fileName)

	res, content, err := fileClient.Download(&files.DownloadArg{
		Path: "/" + uploadFileName + ".json",
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

func (*DBXSync) GetTemporaryLink(path string) *Result {
	res, err := fileClient.GetTemporaryLink(&files.GetTemporaryLinkArg{
		Path: path,
	})
	if err != nil {
		return &Result{
			Err: err,
		}
	}

	return &Result{
		Content: res.Link,
	}
}

func (*DBXSync) UploadRawFile(baseDir string) *Result {
	selectedPath, err := runtime.OpenFileDialog(app.Ctx, runtime.OpenDialogOptions{})
	if err != nil {
		logger.Error.Println(err)
		return &Result{
			Err: err,
		}
	}

	reader, err := os.Open(selectedPath)
	if err != nil {
		logger.Error.Println(err)
		return &Result{
			Err: err,
		}
	}

	baseDir = GetFileName(baseDir)

	if baseDir[1:] != "/" {
		baseDir = baseDir + "/"
	}

	if baseDir[:1] != "/" {
		baseDir = "/" + baseDir
	}

	fileExt := strings.Join(strings.Split(selectedPath, ".")[1:], "")
	randFileName := utils.GetRandString(32)
	fullPath := baseDir + string(randFileName) + "." + fileExt

	logger.Info.Println("Uploading file", fullPath)

	_, err = fileClient.Upload(&files.UploadArg{
		CommitInfo: files.CommitInfo{
			Mode: &files.WriteMode{
				Tagged: dropbox.Tagged{Tag: "overwrite"},
			},
			Path: fullPath,
		},
	}, reader)

	if err != nil {
		logger.Error.Println("Error uploading file", baseDir, err)
		return &Result{Err: err}
	}

	logger.Info.Println("Finished uploading", fullPath)

	return &Result{Content: fullPath}
}
