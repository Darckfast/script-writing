interface Story {
	name?: string
	storyName: string
	ifid: string
	passages: StoryNode[]
	createdWith?: string

	optionals?: {
		[key: string]: any
	}
}

interface StoryNode {
	parentPid?: string
	pid: string
	name: string | number
	cleanText: string
	links: Link[]

	[key: string]: any
}

interface Props {
	// [key: string]: any
	name: string
	value: any
	type: string
}

interface Link {
	pid: string
}
