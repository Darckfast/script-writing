import { add, props, remove, update } from './nodesv2'

import { describe, expect, it, beforeEach } from 'vitest'

describe('nodev2', () => {
	let baseNodes = []

	beforeEach(() => {
		baseNodes = [
			{
				cleanText: 'first base node',
				links: [{ pid: '2' }],
				name: 'line-1',
				pid: '1',
				parentPid: ''
			},
			{
				cleanText: 'second base node',
				links: [{ pid: '3' }],
				name: 'line-2',
				pid: '2',
				parentPid: '1'
			},
			{
				cleanText: 'second base node',
				links: [],
				name: 'line-3',
				pid: '3',
				parentPid: '2'
			}
		]
	})

	it('should not add the node', () => {
		const node = {
			cleanText: 'new node',
			links: [],
			name: 'line-4',
			pid: '4'
		}

		const nodes = add({
			nodes: baseNodes,
			add: node
		})

		expect(nodes).not.toBeUndefined
		expect(nodes).to.have.lengthOf(3)
		expect(nodes[2]).toHaveProperty('pid', '3')
		expect(nodes[2]).toHaveProperty('parentPid', '2')
		expect(nodes[2]).toHaveProperty('links')
		expect(nodes[2].links).toHaveLength(0)
	})

	it('should add a node', () => {
		const node = {
			cleanText: 'new node',
			links: [],
			name: 'line-4',
			pid: '4',
			parentPid: '3'
		}

		const nodes = add({ nodes: baseNodes, add: node })

		expect(nodes).not.toBeUndefined
		expect(nodes).toHaveLength(4)
		expect(nodes[3]).toHaveProperty('name', node.name)
		expect(nodes[3]).toHaveProperty('pid', node.pid)
		expect(nodes[3]).toHaveProperty('parentPid', node.parentPid)

		expect(nodes[2]).toHaveProperty('pid', '3')
		expect(nodes[2]).toHaveProperty('parentPid', '2')
		expect(nodes[2]).toHaveProperty('links')
		expect(nodes[2].links).toHaveLength(1)
		expect(nodes[2].links[0]).toHaveProperty('pid', '4')
	})

	it('should remove a node', () => {
		const nodeToRemove = baseNodes[1]

		const nodes = remove({ nodes: [...baseNodes], remove: nodeToRemove })

		expect(nodes).toHaveLength(2)
		expect(nodes[0]).toHaveProperty('pid', '1')
		expect(nodes[0]).toHaveProperty('name', 'line-1')
		expect(nodes[0]).toHaveProperty('parentPid', '')
		expect(nodes[0]).toHaveProperty('links')
		expect(nodes[0].links).toHaveLength(1)
		expect(nodes[0].links[0]).toHaveProperty('pid', '3')

		expect(nodes[1]).toHaveProperty('pid', '3')
		expect(nodes[1]).toHaveProperty('name', 'line-3')
		expect(nodes[1]).toHaveProperty('parentPid', '1')
		expect(nodes[1]).toHaveProperty('links')
		expect(nodes[1].links).toHaveLength(0)
	})

	it('should not remove a node', () => {
		const nodeToRemove = {
			cleanText: 'new node',
			links: [],
			name: 'line-4',
			pid: '4'
		}

		const nodes = remove({ nodes: baseNodes, remove: nodeToRemove })

		expect(nodes).toHaveLength(3)
	})

	it('should update a node', () => {
		const nodeToUpdate = {
			cleanText: 'new node 1',
			links: [{ pid: '2' }],
			name: 'line-5',
			pid: '1'
		}

		const nodes = update({ nodes: baseNodes, update: nodeToUpdate })

		expect(nodes).toHaveLength(3)
		expect(nodes[0]).toHaveProperty('pid', nodeToUpdate.pid)
		expect(nodes[0]).toHaveProperty('name', nodeToUpdate.name)
		expect(nodes[0]).toHaveProperty('cleanText', nodeToUpdate.cleanText)
		expect(nodes[0]).toHaveProperty('links')
		expect(nodes[0].links).toHaveLength(nodeToUpdate.links.length)
	})

	it('should return the node props', () => {
		const node = {
			cleanText: 'new node 1',
			links: [{ pid: '2' }],
			name: 'line-5',
			pid: '1',
			likes: 1,
			comments: 12,
			upvotes: 123,
			sentBy: 'myself'
		}

		const nodeProps = props(node)

		expect(nodeProps).not.toBeUndefined
		expect(nodeProps).toHaveLength(6)
		// expect(nodeProps).toHaveProperty('upvotes',node.upvotes)
		// expect(nodeProps).toHaveProperty('likes',node.likes)
		// expect(nodeProps).toHaveProperty('comments',node.comments)
		// expect(nodeProps).toHaveProperty('sentBy',node.sentBy)
		// expect(nodeProps).to.not.have.property('pid')
		// expect(nodeProps).to.not.have.property('links')
	})
})
