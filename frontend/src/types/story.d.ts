interface Story {
  name?: string
  baseDir: string
  type: string
  group: string
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

type TPropType = 'boolean' | 'text' | 'number' | 'file'
interface TProp extends Record<string, any> {
  name: string
  value: any
  type: TPropType
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

interface TAddNode {
  nodeToAdd: StoryNode
  nodes: StoryNode[]
}

interface TPropForm {
  name: string
  placeholder?: string
  baseDir?: string
  type: 'boolean' | 'text' | 'number' | 'file'
  value:
    | string
    | number
    | TGetImagePromise
    | boolean
    | undefined
}
