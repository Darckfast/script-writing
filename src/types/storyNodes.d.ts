interface Story {
	name: string
	ifid: string
	passages: StoryNode[]
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
	[key: string]: any
}

interface Link {
	pid: string
}
