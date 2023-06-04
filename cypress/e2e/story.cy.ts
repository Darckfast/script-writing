import { getComponent } from './utils'

describe('story page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5177')

    getComponent('input-story-name', 'input').type('new story')
    getComponent('btn-create-story').click()
    getComponent('a-story-node-0').click()
  })

  it('should create new node in the story', () => {
    getComponent('node-input-1', 'textarea').type('first node')
    getComponent('node-input-1', 'textarea').should('have.value', 'first node')

    getComponent('node-add-1', 'button').click()

    getComponent('node-input-2', 'textarea').type('second node')
    getComponent('node-input-2', 'textarea').should('have.value', 'second node')
  })

  it('should add prop of type text in the story node', () => {
    getComponent('input-prop', 'input').type('testProp')
    getComponent('add-prop').click()
    getComponent('node-prop-menu-1').click()
    getComponent('node-prop-add-testProp').click()
    getComponent('node-prop-1-testProp', 'input').should('exist')
    getComponent('node-prop-1-testProp', 'input').type('prop of type text', {
      force: true,
    })
    getComponent('node-prop-1-testProp', 'input').should(
      'have.value',
      'prop of type text'
    )
  })

  it('should add prop of type number in the story node', () => {
    getComponent('input-prop', 'input').type('testProp')
    getComponent('radio-prop-number', 'input').click()
    getComponent('add-prop').click()
    getComponent('node-prop-menu-1').click()
    getComponent('node-prop-add-testProp').click()
    getComponent('node-prop-1-testProp', 'input').should('exist')
    getComponent('node-prop-1-testProp', 'input').type('12.34', {
      force: true,
    })
    getComponent('node-prop-1-testProp', 'input').should('have.value', '12.34')
  })

  it('should add prop of type boolean in the story node', () => {
    getComponent('input-prop', 'input').type('testProp')
    getComponent('radio-prop-boolean', 'input').click()
    getComponent('add-prop').click()
    getComponent('node-prop-menu-1').click()
    getComponent('node-prop-add-testProp').click()
    getComponent('node-prop-1-testProp', 'input').should('exist')
    getComponent('node-prop-1-testProp', 'input').should('have.been.checked')
  })

  it('should remove prop from the story node', () => {
    getComponent('input-prop', 'input').type('testProp')
    getComponent('radio-prop-boolean', 'input').click()
    getComponent('add-prop').click()
    getComponent('node-prop-menu-1').click()
    getComponent('node-prop-add-testProp').click()

    getComponent('node-prop-remove-1-testProp').click({ force: true })
    getComponent('node-prop-remove-1-testProp').click({ force: true })
    getComponent('node-prop-1-testProp', 'input').should('not.exist')
  })

  it('should unlink a child node, when clicked on the unlink btn', () => {
    getComponent('node-input-1', 'textarea').type('first node')

    getComponent('node-add-1', 'button').click()

    getComponent('node-input-2', 'textarea').type('second node')

    getComponent('node-unlink-1').click()

    cy.get('.svelvet-anchor.input.connected').should('not.exist')
  })
})
