import type { Connections } from 'svelvet'

interface AddNode {
  nodeToAdd: StoryNode
  nodes: StoryNode[]
}

const add = ({ nodeToAdd, nodes }: AddNode): StoryNode[] => {
  nodes.push(nodeToAdd)

  return nodes
}

const remove = ({
  removeNode,
  nodes,
}: {
  removeNode: StoryNode
  nodes: StoryNode[]
}): StoryNode[] => {
  return nodes.filter((node) => {
    node.links = node.links.filter((link) => link.pid !== removeNode.pid)

    return node.pid !== removeNode.pid
  })
}

const update = ({
  update,
  nodes,
}: {
  update: { pid: string | number; [key: string]: any }
  nodes: StoryNode[]
}): StoryNode[] => {
  // const nodesClone = structuredClone({...nodes})

  return nodes.map((node) => {
    if (node.pid === update.pid) {
      return {
        ...node,
        ...update,
      }
    }

    return node
  })
}

const props = (object: any): TProp[] => {
  if (object === undefined) {
    return []
  }

  const passageProps: TProp[] = []

  const { pid } = object

  for (const [key, value] of Object.entries<any>(object)) {
    if (
      [
        'passages',
        'links',
        'row',
        'pid',
        'ifid',
        'col',
        'isTrusted',
        'text',
        'cleanText',
        'position',
        'name',
        'parentPid',
        'version',
      ].includes(key)
    )
      continue

    passageProps.push({
      name: key,
      value,
      type: 'text',
      pid,
    })
  }

  return passageProps.sort((a, b) => a.name.localeCompare(b.name))
}

const isRoot = (node) => {
  return node.pid === 'root' || node.pid === 1
}

const getConnections = (passage: StoryNode): Connections => {
  // const passageClone: StoryNode = structuredClone({ ...passage })

  return passage.links?.map((link) => [
    `node-${link.pid}`,
    `link-out-${link.pid}`,
  ])
}

export { props, add, remove, update, isRoot, getConnections }
