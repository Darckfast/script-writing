package types

type SingleBundle struct {
	Name    string `json:"name"`
	Content []any  `json:"content"`
}

type Bundle []SingleBundle

func (bundles *Bundle) FindByName(bundleName string) *SingleBundle {
	for index, bundle := range *bundles {
		if bundle.Name == bundleName {
			return &(*bundles)[index]
		}
	}

	return nil
}
