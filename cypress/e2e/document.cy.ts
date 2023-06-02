describe('document page', () => {
  const getCopyBtn = () => cy.get('button[data-test="btn-copy-content"]')
  const getDeleteBtn = () => cy.get('button[data-test="btn-delete-document"]')
  const createDoc = () =>
    cy.get('button[data-test="btn-create-document"]').click()
  const accessDoc = () => cy.get('a[data-test="a-document-node-0"]').click()

  beforeEach(() => {
    cy.visit('http://localhost:5177')
    cy.get('input').type('new document')
  })

  it('create document content', () => {
    createDoc()
    accessDoc()

    cy.get('div.cm-content').clear().type('{"test": true}', {
      force: true,
      parseSpecialCharSequences: false,
    })

    getCopyBtn().click()
  })

  it('create and remove document', () => {
    createDoc()
    getDeleteBtn().dblclick()

    cy.get('span[data-test="empty-doc-placeholder"]').should(
      'have.text',
      'no documents available'
    )
  })
})
