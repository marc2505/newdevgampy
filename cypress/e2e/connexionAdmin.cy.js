describe('Connexion', () => {
  it('Connects with thomasdeslandres86@gmail.com', () => {
    cy.visit('https://keums.com')
    cy.get('#dropdown-basic').click()
    cy.get('[href="/admin/login"]').click()
    cy.get('#formBasicEmail').type('marcbrunet2505@gmail.com')
    cy.get('#formBasicPassword').type('marc12@')
    cy.get('.text-center > .btn').click()
    cy.wait(1000)
    cy.get('#dropdown-basic').click()
    cy.url().should(
        'eq', 'https://keums.com/admin/home'
    )
    cy.get('.mx-auto > .mx-3').should(
        'have.text',
        'Se déconnecter'
    )
    cy.get('[href="/dashboard"]').should(
        'have.text',
        'Admin : Brunet Marc'
    )

  })
})