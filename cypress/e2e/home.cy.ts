const mockStory = {"ifid":"5e3d4e94-7462-4313-b823-094b088fa052","passages":[{"isTrusted":true,"parentPid":"","pid":"8f5557c7-921c-45fe-8f1e-83719816a375","name":1,"cleanText":"","links":[]}],"createdWith":"dev","storyName":"Test"}

describe('empty spec', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5177')
	})

	it('check buttons', () => {
		cy.get('.self-end > .flex > :nth-child(1)').should('have.text', '+ create new')
		cy.get('.self-end > .flex > :nth-child(2)').should('have.text', '+ import from clipboard')
		cy.get('.self-end > .flex > :nth-child(3)').should('have.text', '> export all stories')
	})

	it('create new story from button', () => {
		cy.get('input').type('new story')
		cy.get('.self-end > .flex > :nth-child(1)').click()
		cy.get('main > div > a').should('have.text', 'new story ')
	})
})
