import { globalError } from './stores/globalError'

const rebuildLinks = (nodes: StoryNode[], fix = false) => {
  let totalFixed = 0

  for (const [index, node] of nodes.entries()) {
    node.name = `${index + 1}`

    if (!index) continue

    const prevNode = nodes[index - 1]

    if (!prevNode?.links?.length) continue

    if (prevNode.links[0].pid !== node.pid) {
      totalFixed += 1

      nodes[index - 1].links = [{ pid: node.pid }]
    }
  }

  if (totalFixed) {
    globalError.pushError(new Error(`fixed ${totalFixed} orphan nodes`))
  }

  return nodes
}

const add = ({
  add: nodeToAdd,
  nodes,
  beginning = false,
}: {
  add: StoryNode
  nodes: StoryNode[]
  beginning?: boolean
}): StoryNode[] => {
  let hasParent = false
  if (!nodes.length) hasParent = true
  for (const node of [...nodes]) {
    if (node.pid === nodeToAdd.parentPid) {
      if (!node.links) {
        node.links = []
      }

      hasParent = true

      node.links.push({ pid: nodeToAdd.pid })
    }
  }

  if (hasParent) {
    if (beginning) {
      nodes = [nodeToAdd, ...nodes]
    } else {
      nodes.push(nodeToAdd)
    }
  }

  return nodes.map((node) => patchUp(node))
}

const remove = ({
  remove,
  nodes,
}: {
  remove: StoryNode
  nodes: StoryNode[]
}): StoryNode[] => {
  let newNodes = []

  for (const node of [...nodes]) {
    if (node.pid === remove.parentPid && node.links) {
      node.links = node.links.filter((nd) => nd.pid !== remove.pid)
    }

    if (node.parentPid === remove.pid) {
      node.parentPid = remove.parentPid
    }

    if (node.pid !== remove.pid) {
      newNodes.push(node)
    } else {
      newNodes = newNodes.map((nNode) => {
        if (nNode.pid === node.parentPid) {
          nNode.links = nNode.links.concat(node.links)
        }

        return nNode
      })
    }
  }

  return newNodes
}

const update = ({
  update,
  nodes,
}: {
  update: { pid: string; [key: string]: any }
  nodes: StoryNode[]
}): StoryNode[] => {
  return [...nodes].map((node) => {
    if (node.pid === update.pid) {
      return {
        ...node,
        ...update,
      }
    }

    return node
  })
}

const props = (object: any): Props[] => {
  if (object === undefined) {
    return []
  }

  const passageProps: { name: string; value: string; type: string }[] = []

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const element = object[key]

      if (
        ![
          'passages',
          'links',
          'row',
          'pid',
          'ifid',
          'col',
          'isTrusted',
          'position',
          'text',
          'cleanText',
          'name',
          'parentPid',
          'version',
        ].includes(key)
      ) {
        passageProps.push({ name: key, value: element, type: 'text' })
      }
    }
  }

  return passageProps.sort((a, b) => a.name.localeCompare(b.name))
}

const patchUp = (node: StoryNode): StoryNode => {
  for (const key in node) {
    if (Object.prototype.hasOwnProperty.call(node, key)) {
      if (['pid', 'parentPid'].includes(key)) {
        node[key] = `${node[key]}`
      }
    }
  }

  return node
}

const fixOrphanNodes = (nodes: StoryNode[]) => {
  let fixed = 0
  for (const [index, node] of nodes.entries()) {
    if (node.links.length > 1) continue

    if (node === nodes.at(-1)) continue

    if (node.links[0].pid === nodes[index + 1].pid) continue

    fixed++

    node.links[0].pid = nodes[index + 1].pid
  }

  globalError.pushError(`fixed ${fixed} orphan nodes`)

  return nodes
}

export { props, add, remove, update, fixOrphanNodes }
