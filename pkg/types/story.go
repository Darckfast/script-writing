package types

type Link struct {
	Pid int `json:"pid,omitempty"`
}

type Story struct {
	Ifid           string `json:"ifid"`
	Passages       []any  `json:"passages"`
	StoryName      string `json:"storyName"`
	Type           string `json:"type"`
	ExportOnBundle bool   `json:"exportOnBundle"`
	Group          string `json:"group"`
}

type Stories []Story

func (stories *Stories) FindStory(ifid string) *Story {
	for _, story := range *stories {
		if story.Ifid == ifid {
			return &story
		}
	}

	return nil
}

type Passage struct {
	Pid        int    `json:"pid"`
	CleanText  string `json:"cleanText"`
	Links      []Link `json:"links"`
	Image      string `json:"image,omitempty"`
	Sub        string `json:"sub,omitempty"`
	SentBy     string `json:"sentBy,omitempty"`
	Likes      int    `json:"likes,omitempty"`
	Trigger    string `json:"trigger,omitempty"`
	Condition  string `json:"condition,omitempty"`
	Comments   int    `json:"comments,omitempty"`
	Sent       string `json:"sent,omitempty"`
	SentOn     string `json:"sentOn,omitempty"`
	Seen       bool   `json:"seen,omitempty"`
	LinkChosen int    `json:"linkChosen,omitempty"`
	KeepFormat bool   `json:"keepFormat,omitempty"`
}
