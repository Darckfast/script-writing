import { get } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { load } from '../../lib/functions/loadSave/loadSave'
import { props } from '../../lib/functions/node.utils/nodes.utils'
import { localProps } from './localProps'
import { createSaveable } from './saveable'

export const {
  initialObject: stories,
  isFetching: storiesFetching,
  updateLocal: updateLocalStories,
  lastUpdate: storiesLastUpdate,
  doSync: storiesSync
} = createSaveable<Story[]>({
  initialSate: [],
  key: 'stories'
})

export const getPropsAsObject = (
  passage: StoryNode,
  storyId = ''
) => {
  let basePosition = { x: 0, y: 0 }

  if (passage.position?.x !== undefined) {
    basePosition = structuredClone(passage.position)
  }

  basePosition.x = basePosition.x - 350

  const storyProps = []

  const nodeProps = props(passage)
  const convProps = []
  for (let i = 0; i < nodeProps.length; i++) {
    nodeProps[i].position = {
      x: basePosition.x ?? 0,
      y: basePosition.y ?? 0 + i * 50
    }

    nodeProps[i].id = uuidv4()

    convProps.push(nodeProps[i])
  }

  console.log(convProps)
  return convProps
}

export function calculateLeafPositions(
  passages: StoryNode[],
  storyId: string
) {
  const root = passages[0]

  traverse(root, 0, 0)

  function traverse(
    node: StoryNode,
    x: number,
    y: number
  ): void {
    node.position = { x, y }

    if (node.links === undefined) {
      node.links = []
      return
    }

    const links = node.links

    const children = links
      .map((link) =>
        passages.find((passage) => passage.pid === link.pid)
      )
      .filter((child) => child !== undefined)

    const width = children.length * 600
    const xOffset = width / (children.length + 1)
    let childX = x - width / 2 + xOffset

    const nodeHasImage = node.image !== undefined

    children.forEach((child) => {
      traverse(
        child,
        childX,
        nodeHasImage ? y + 650 : y + 200
      )
      childX += xOffset
    })
  }
}
