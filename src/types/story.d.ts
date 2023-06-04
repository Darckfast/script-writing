interface Story {
  name?: string
  storyName: string
  ifid: string
  passages: StoryNode[]
  latestPid?: number
  createdWith?: string
}

interface StoryNode {
  pid: string | number
  name: string | number
  cleanText: string
  links: TLink[]
  position?: TPosition

  [key: string]: any
}

interface TLink {
  pid: string | number
}
interface TPosition {
  x: number
  y: number
}

interface TProp {
  name: string
  value: any
  type: string
  pid?: string | number
  id?: string
  position?: {
    x: number
    y: number
  }
}

interface AnchorStore<T = any> {
  anchor: {
    store: CustomWritable<T>
  }
}

type TLinkCustom = { link: CustomWritable<TLink> }
type TOnLink = CustomEvent<AnchorStore<TLinkCustom>>
