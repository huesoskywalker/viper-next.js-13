/// <reference types="cypress" />
export {}
const viperId = "6420c36024eee4e8dba9c081"

Cypress.Commands.add("getByData", (selector) => {
    return cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add("signInWithCredential", (viperName, password) => {
    // Caching session when logging in via page visit
    cy.session(
        viperName,
        () => {
            cy.log(`Viper App`)
            cy.visit("/")
            cy.getByData("signIn").contains("Sign in").click()
            cy.url().should("include", "/api/auth/signin")
            cy.get("#input-username-for-1-test-provider").type(viperName)
            cy.get("#input-password-for-1-test-provider").type(password)
            cy.get(":nth-child(4) > form > button").click()
            cy.url().should("include", "/")
            cy.api("/api/auth/session").then((response) => {
                expect(response.status).eq(200)
                expect(response.body).to.have.all.keys("user", "expires")
                expect(response.body.user.name).eq(viperName)
            })
            cy.getCookie("next-auth.session-token").should("exist")
            cy.getByData("nav-item").contains(viperName)
            cy.log("Cypress login successful")
            cy.api({
                url: `/api/viper/id/${viperId}`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.viper).to.not.be.null
                expect(response.body.viper._id).to.be.a("string")
                expect(response.body.viper.name).eq(viperName)
                expect(response.body.viper.email).to.be.a("string")
                expect(response.body.viper.image).to.be.a("string")
            })
            cy.log("Success Session")
        },
        { cacheAcrossSpecs: true }

        // {
        //     validate() {
        //         cy.api("/api/auth/session")
        //             .its("status")
        //             .should("eq", 200)
        //             .then(() => {
        //                 cy.log("Cypress login successful")
        //             })
        //     },
        // }
    )
    cy.visit("/")
})

// Cypress.Commands.add("login", () => {
//     cy.intercept("http://localhost:3000/api/auth/session", {
//         fixture: "session.json",
//     }).as("session")

//     // Set the cookie for cypress.
//     // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
//     // This step can probably/hopefully be improved.
//     // We are currently unsure about this part.
//     // We need to refresh this cookie once in a while.
//     // We are unsure if this is true and if true, when it needs to be refreshed.
//     cy.setCookie(
//         "next-auth.session-token",
//         "c2a41b55-5806-44b1-b9a7-0fddeadf6ab8"
//     )
//     // Cypress.Cookies.preserveOnce("next-auth.session-token")
// })
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
