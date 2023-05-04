describe('story page', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5177')
		cy.get('input').type('new story')
		cy.get('button[data-test="btn-create-story"]').click()
		cy.get('a[data-test="a-story-node-0"]').click()
	})

	it('create new node', () => {
		cy.get('input[data-test="input-node"]').type('first node')
		cy.get('button[data-test="add-node"]').click()
		cy.get('input[data-test="input-node"]').type('second node')

		cy.get('span[data-test="node-name-1"] ').should('have.text', '1')
		cy.get('span[data-test="node-text-1"] ').should('have.text', 'first node')

		cy.get('span[data-test="node-name-2"] ').should('have.text', '2')
		cy.get('span[data-test="node-text-2"] ').should('have.text', 'second node')
	})

	it('add prop of type number', () => {
		cy.get('input[data-test="input-prop"]').type('testProp')
		cy.get('button[data-test="add-prop"]').click()

		cy.get('button[data-test="add-local-prop-testProp"]').click()

		cy.get('input[data-test="input-node-prop-testProp"]').should('exist')

		cy.get('input[data-test="input-node-prop-testProp"]').type(
			'prop of type text'
		)

		cy.get('input[data-test="input-node-prop-testProp"]').should(
			'have.value',
			'prop of type text'
		)
	})

	it('add prop of type text', () => {
		cy.get('input[data-test="input-prop"]').type('testProp')
		cy.get('input[data-test="radio-prop-number"]').click({ force: true })

		cy.get('button[data-test="add-prop"]').click()

		cy.get('button[data-test="add-local-prop-testProp"]').click()

		cy.get('input[data-test="input-node-prop-testProp"]').should('exist')

		cy.get('input[data-test="input-node-prop-testProp"]').type('12.34')

		cy.get('input[data-test="input-node-prop-testProp"]').should(
			'have.value',
			'12.34'
		)
	})

	it('add prop of type boolean', () => {
		cy.get('input[data-test="input-prop"]').type('testProp')
		cy.get('input[data-test="radio-prop-boolean"]').click({ force: true })

		cy.get('button[data-test="add-prop"]').click()

		cy.get('button[data-test="add-local-prop-testProp"]').click()
		cy.get('input[data-test="input-node-prop-testProp"]').click()

		cy.get('input[data-test="input-node-prop-testProp"]').should('exist')

		cy.get('input[data-test="input-node-prop-testProp"]').should(
			'have.been.checked'
		)
	})

	it('remove prop', () => {
		cy.get('input[data-test="input-prop"]').type('testProp')
		cy.get('button[data-test="add-prop"]').click()

		cy.get('button[data-test="add-local-prop-testProp"]').click()

		cy.get('button[data-test="remove-node-prop-testProp"]').click()
		cy.get('button[data-test="remove-node-prop-testProp"]').click()

		cy.get('input[data-test="input-node-prop-testProp"]').should('not.exist')

		cy.get('button[data-test="remove-local-prop-testProp"]').click()
		cy.get('button[data-test="remove-local-prop-testProp"]').click()

		cy.get('input[data-test="input-local-prop-testProp"]').should('not.exist')
	})
})
