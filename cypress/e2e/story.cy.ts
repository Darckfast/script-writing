import { getComponent } from './utils'

describe('story page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5177')

    getComponent('input-story-name', 'input').type('new story')
    getComponent('btn-create-story').click()
    getComponent('a-story-node-0').click()
  })

  it('create new node', () => {
    getComponent('node-input-1', 'textarea').type('first node')
    getComponent('node-input-1', 'textarea').should('have.value', 'first node')

    getComponent('node-add-1', 'button').click()

    getComponent('node-input-2', 'textarea').type('second node')
    getComponent('node-input-2', 'textarea').should('have.value', 'second node')
  })

  it('add prop of type text', () => {
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

  it('add prop of type number', () => {
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

  it('add prop of type boolean', () => {
    getComponent('input-prop', 'input').type('testProp')
    getComponent('radio-prop-boolean', 'input').click()
    getComponent('add-prop').click()
    getComponent('node-prop-menu-1').click()
    getComponent('node-prop-add-testProp').click()
    getComponent('node-prop-1-testProp', 'input').should('exist')
    getComponent('node-prop-1-testProp', 'input').should('have.been.checked')
  })

  it('remove prop', () => {
    getComponent('input-prop', 'input').type('testProp')
    getComponent('radio-prop-boolean', 'input').click()
    getComponent('add-prop').click()
    getComponent('node-prop-menu-1').click()
    getComponent('node-prop-add-testProp').click()

    getComponent('node-prop-remove-1-testProp').click({ force: true })
    getComponent('node-prop-remove-1-testProp').click({ force: true })
    getComponent('node-prop-1-testProp', 'input').should('not.exist')
  })
})
