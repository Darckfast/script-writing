describe('document page', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5177')
		cy.get('input').type('new document')
		cy.get('button[data-test="btn-create-document"]').click()
		cy.get('a[data-test="a-document-node-0"]').click()
	})

	it('create document content', () => {
		cy.get('div.cm-content').clear().type('{"test": true}',
     { 
      force: true,
      parseSpecialCharSequences:false 
    })
	})

})
