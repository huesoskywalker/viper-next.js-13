describe("My First Test", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })
    it("Gets, types and asserts", () => {
        // cy.contains("type").click()

        // cy.url().should("include", "/commands/actions")

        // Get an input, type into it
        cy.get(".action-email").type("fake@email.com")

        //  Verify that the value has been updated
        cy.get(".action-email").should("have.value", "fake@email.com")

        cy.location("pathname").should("eq", "/something")
    })
})
