describe('empty spec', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5177')
		cy.get('input').type('new story')
		cy.get('.self-end > .flex > :nth-child(1)').click()
		cy.get('main > div > a').click()

	})

	it('create new node', () => {	
		cy.get('.relative > .mt-2 > :nth-child(1)').should('have.text', '+ new')
		cy.get('.relative > .mt-2 > :nth-child(2)').should('have.text', '+ duplicate node')

		cy.get('.relative > .mt-2 > :nth-child(1)').click()
		cy.get('.no-animation > .text-xs').should('have.text', '1')
		cy.get('.overflow-y-scroll > :nth-child(2) > .input').should('have.value', 'new story')
		cy.get('.h-20').type('testing node')
		cy.get('.no-animation > .text-sm').should('have.text', 'testing node')
	})

	it('add prop of type text', () => {	
		cy.get('.relative > .mt-2 > :nth-child(1)').should('have.text', '+ new')
		cy.get('.relative > .mt-2 > :nth-child(2)').should('have.text', '+ duplicate node')

		cy.get('.relative > .mt-2 > :nth-child(1)').click()
		cy.get('.no-animation > .text-xs').should('have.text', '1')
		cy.get('.overflow-y-scroll > :nth-child(2) > .input').should('have.value', 'new story')
		cy.get('.h-20').type('testing node')
		cy.get('.no-animation > .text-sm').should('have.text', 'testing node')

		// add new prop - text
		cy.get('.mt-2 > .justify-between > :nth-child(1) > .input').type('testProp')
		cy.get('.p-1 > .input').type('propValue')
		cy.get('.mt-2 > .justify-between > .btn').click()
		
		// add prop to the story
		cy.get(':nth-child(7) > .input').should('have.value', 'propValue')
		cy.get(':nth-child(7) > :nth-child(1)').click()
		cy.get(':nth-child(6) > .input').should('have.value', 'propValue')
		cy.get(':nth-child(6) > .cursor-pointer').dblclick()

		cy.get('.no-animation > .cursor-pointer').dblclick()
		cy.get('.no-animation').should('not.exist')
	})

	it('add prop of type boolean', () => {	
		cy.get('.relative > .mt-2 > :nth-child(1)').should('have.text', '+ new')
		cy.get('.relative > .mt-2 > :nth-child(2)').should('have.text', '+ duplicate node')
		
		//create node
		cy.get('.relative > .mt-2 > :nth-child(1)').click()
		cy.get('.no-animation > .text-xs').should('have.text', '1')
		cy.get('.overflow-y-scroll > :nth-child(2) > .input').should('have.value', 'new story')
		cy.get('.h-20').type('testing node')
		cy.get('.no-animation > .text-sm').should('have.text', 'testing node')

		// add new prop - text
		cy.get('.mt-2 > .justify-between > :nth-child(1) > .input').type('testProp')
		cy.get('.gap-4 > :nth-child(2)').click()
		cy.get('.p-1 > .toggle').click()
		cy.get('.mt-2 > .justify-between > .btn').click()
		
		// add prop to the story
		cy.get(':nth-child(7) > .toggle').should('have.value', 'on')
		cy.get(':nth-child(7) > :nth-child(1)').click()
		cy.get(':nth-child(6) > .toggle').should('have.value', 'on')
	})

	it('add prop of type number', () => {	
		cy.get('.relative > .mt-2 > :nth-child(1)').should('have.text', '+ new')
		cy.get('.relative > .mt-2 > :nth-child(2)').should('have.text', '+ duplicate node')
		
		//create node
		cy.get('.relative > .mt-2 > :nth-child(1)').click()
		cy.get('.no-animation > .text-xs').should('have.text', '1')
		cy.get('.overflow-y-scroll > :nth-child(2) > .input').should('have.value', 'new story')
		cy.get('.h-20').type('testing node')
		cy.get('.no-animation > .text-sm').should('have.text', 'testing node')

		// add new prop - text
		cy.get('.mt-2 > .justify-between > :nth-child(1) > .input').type('testProp')
		cy.get('.gap-4 > :nth-child(3)').click()
		cy.get('.p-1 > .input').type('1234')
		cy.get('.mt-2 > .justify-between > .btn').click()
		
		// add prop to the story
		cy.get(':nth-child(7) > .input').should('have.value', '1234')
		cy.get(':nth-child(7) > :nth-child(1)').click()
		cy.get(':nth-child(6) > .input').should('have.value', '1234')
	})
})
