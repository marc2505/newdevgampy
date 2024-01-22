describe('Connexion', () => {
  it('Connects with thomasdeslandres86@gmail.com', () => {
    cy.visit('https://keums.com')
    cy.get('[href="/login"]').click()
    cy.get('#formBasicEmail').type('thomasdeslandres86@gmail.com')
    cy.get('#formBasicPassword').type('thomas12@')
    cy.get('.text-center > .btn').click()
    cy.wait(1000)
    cy.get('#dropdown-basic').click()
    cy.url().should(
        'eq', 'https://keums.com/home'
    )
    cy.get('.mx-auto > [href="/home"]').should(
        'have.text',
        'Se déconnecter'
    )
    cy.get('.dropdown > .text-center > div').should(
        'have.text',
        'Deslandres Thomas'
    )

  })
})