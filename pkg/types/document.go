package types

type Document struct {
	Name    string `json:"name"`
	Id      string `json:"id"`
	Content struct {
		Text string `json:"text"`
	} `json:"content"`
}


type Documents []Document	