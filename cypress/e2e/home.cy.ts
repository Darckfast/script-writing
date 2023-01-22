const mockStory = {
	ifid: '5e3d4e94-7462-4313-b823-094b088fa052',
	passages: [
		{
			isTrusted: true,
			parentPid: '',
			pid: '8f5557c7-921c-45fe-8f1e-83719816a375',
			name: 1,
			cleanText: '',
			links: []
		}
	],
	createdWith: 'dev',
	storyName: 'Test'
}

describe('home page', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5177')
	})

	it('check buttons', () => {
		cy.get('button[data-test="btn-create-story"]').should(
			'have.text',
			'+ create new'
		)
		cy.get('button[data-test="btn-import-story"]').should(
			'have.text',
			'+ import from clipboard'
		)
		cy.get('button[data-test="btn-export-story"]').should(
			'have.text',
			'> export all stories'
		)
		cy.get('a[data-test="a-config"]').should('have.text', '$ configuration')
		cy.get('button[data-test="btn-sync-story"]').should('have.text', '+ sync')
	})

	it('create new story from button', () => {
		cy.get('input[data-test="input-story-name"]').type('new story')
		cy.get('button[data-test="btn-create-story"]').click()
		cy.get('a[data-test="a-story-node-0"]').should('have.text', 'new story')
	})

	it('delete story', () => {
		cy.get('input[data-test="input-story-name"]').type('new story')
		cy.get('button[data-test="btn-create-story"]').click()

		cy.get('button[data-test="btn-delete-story"]').click()
		cy.get('button[data-test="btn-delete-story"]').click()

		cy.get('a[data-test="a-story-node-0"]').should('not.exist')
	})

	it('copy story', () => {
		cy.get('input[data-test="input-story-name"]').type('new story')
		cy.get('button[data-test="btn-create-story"]').click()
		cy.get('button[data-test="btn-export-story"]').click()
	})

	it('import story', () => {
		cy.get('input[data-test="input-story-name"]').type('new story')
		cy.get('button[data-test="btn-create-story"]').click()
		cy.get('button[data-test="btn-export-story"]').click()

		cy.get('button[data-test="btn-import-story"]').click()
		cy.get('a[data-test="a-story-node-0"]').should('have.text', 'new story')
	})
})
