interface Story {
	name: string
	ifid?: string
	passages?: Node[]
}

interface StoryNode {
	parentPid?: string
	pid: string
	name: string
	cleanText: string
	links: Link[]
	// col?: number
	// row?: number
	[key: string]: any
}

interface Props {
	[key: string]: any
}

interface Link {
	pid: string
}
