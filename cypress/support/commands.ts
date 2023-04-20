/// <reference types="cypress" />

import { format } from "date-fns"
import _ from "lodash"
import { sessionViper } from "./sessionViper"
import { productInventory } from "./event"
import { eventKeys, productInventoryKey, sessionKeys } from "./objectKeys"
import {
    buildObjectProperties,
    buildProps,
    expectBodyKeyEqualObjectKey,
    expectInterceptionEqualRequestOptions,
    isAliasObject,
    isPathInTarget,
} from "./helperFuncs"

export {}

Cypress.Commands.add("signInWithCredential", (username, password) => {
    cy.session(
        username,
        () => {
            cy.log(`Viper App`)
            cy.visit("/")
            cy.clickButton("signIn", "Sign in")
            cy.url().should("include", "/api/auth/signin")
            cy.get("#input-username-for-1-test-provider").type(username)
            cy.get("#input-password-for-1-test-provider").type(password)
            cy.get(":nth-child(4) > form > button").click()
            cy.url().should("include", "/")
            cy.apiRequestAndResponse(
                {
                    url: "/api/auth/session",
                    headers: {
                        "content-type": "application/json",
                    },
                    method: "GET",
                },
                {
                    status: 200,

                    expectRequest: {
                        keys: sessionKeys,
                        object: {
                            name: username,
                        },
                        path: "user",
                    },
                    build: {
                        object: sessionViper,
                        alias: "session",
                    },
                }
            )

            cy.getCookie("next-auth.session-token").should("exist")
            cy.getByData("nav-item").contains(username)
            cy.log("Cypress login successful")
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
    // .then(() => {
    //     cy.visit("/")

    //     return
    //  cy.get("@session").then((viper: any) => {
    //         cy.getByData("nav-item").contains(viper.name)
    //         cy.log("Cypress login successful")
    //     })
    // })
})

Cypress.Commands.add("getByData", (selector) => {
    return cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add("clickButton", (selector, contains, href?) => {
    if (href) {
        return cy.getByData(selector).contains(contains).should("have.attr", "href", href).click()
    } else {
        return cy.getByData(selector).contains(contains).click()
    }
})

Cypress.Commands.add("inputType", (selector, value) => {
    return cy.getByData(selector).clear().type(value)
})

Cypress.Commands.add("inputSelect", (selector, value) => {
    return cy.getByData(selector).select(value).should("have.value", value)
})

Cypress.Commands.add("dataInContainer", (selector, value) => {
    return cy.getByData(selector).contains(value).should("be.visible")
})

Cypress.Commands.add("apiRequestAndResponse", (requestOptions, responseOptions) => {
    const { url, headers, method, body } = requestOptions
    const { status, expectRequest, build } = responseOptions
    const request =
        method === "GET"
            ? cy.api({
                  url: url,
                  method: method,
                  headers: headers,
              })
            : cy.api({
                  url: url,
                  method: method,
                  headers: headers,
                  body: body,
              })

    request.then((response) => {
        const {
            status: responseStatus,
            requestHeaders,
            headers: responseHeaders,
            body: responseBody,
        } = response
        const targetBody = Array.isArray(responseBody) ? responseBody[0] : responseBody
        expect(responseStatus).to.equal(status)
        expect(requestHeaders).to.include(headers)
        if (expectRequest) {
            const { keys, object, path } = expectRequest
            const targetValue = path ? _.get(targetBody, path) : targetBody
            expect(targetValue).to.have.all.keys(keys)
            // this super wrong bro, why if object? makes no sense
            if (object) {
                // check please ! why if object
                expectBodyKeyEqualObjectKey(targetValue, object)
            }
            if (build) {
                const { object, alias } = build
                buildObjectProperties(targetValue, object, { propPath: path, alias: alias })
            }
        }
    })
})

Cypress.Commands.add(
    "verifyInterceptionRequestAndResponse",
    (interception, requestOptions, responseOptions, dataOptions, buildProperty?) => {
        const {
            statusCode: statusCode,
            headers: responseHeaders,
            body: responseBody,
        } = interception.response
        const { reqHeaders } = requestOptions
        const { resStatus, resHeaders, resBody, resKeys } = responseOptions
        const { source, action } = dataOptions

        const resHeadersAvailable = resHeaders ? resHeaders : reqHeaders

        expect(statusCode).to.equal(resStatus)
        expect(responseHeaders).to.include(resHeadersAvailable)
        // expect(responseBody).to.have.all.keys(resKeys)

        expectInterceptionEqualRequestOptions(interception.request, requestOptions)

        if (Array.isArray(responseBody)) {
            const { body: requestBody } = interception.request
            responseBody.forEach((body: any) => {
                const document = source === "mongodb" ? body.value : body
                // we are missing the keys in here, why?
                // let's play with the keys everywhere to make more gringo

                expectBodyKeyEqualObjectKey(document, resBody)
                expectMongoDBResponse(body)

                if (buildProperty) {
                    console.log(`--verifyCommand buildProp path`)
                    console.log(buildProperty.propPath)
                    buildObjectProperties(requestBody, resBody, buildProperty)
                }
            })
        } else if (buildProperty) {
            buildObjectProperties(responseBody, resBody, buildProperty)

            const { propKeys } = buildProperty
            const [parentKey, ...childKeys] = propKeys.reqKey.split(".")

            if (childKeys.length) {
                const childKey = childKeys.join(".")
                expect(responseBody[parentKey]).to.have.deep.property(childKey)
            } else {
                expect(responseBody).to.have.deep.property(parentKey)
            }
        } else {
            const responseValue = source === "mongodb" ? responseBody.value : responseBody
            // keys here also?
            expectBodyKeyEqualObjectKey(responseValue, resBody)
            if (source === "mongodb") expectMongoDBResponse(responseBody)
        }
    }
)

function expectMongoDBResponse(response: any) {
    // if (action === "edit") {
    expect(response.ok).to.equal(1)
    expect(response.lastErrorObject.n).to.equal(1)
    expect(response.lastErrorObject.updatedExisting).to.equal(true)
    // }
}
// }
// )

Cypress.Commands.add("checkEventComponentProps", (event) => {
    cy.apiRequestAndResponse(
        {
            url: `/api/event/${event._id}`,
            headers: {
                "content-type": "application/json",
            },
            method: "GET",
        },
        {
            status: 200,
            expectRequest: {
                keys: eventKeys,
                object: event,
            },
        }
    )
    cy.getByData("image").should("be.visible")
    cy.dataInContainer("title", event.title)
    cy.dataInContainer("content", event.content)
    cy.dataInContainer("address", event.address)

    cy.apiRequestAndResponse(
        {
            url: `/api/product/inventory/${event.productId.toString().match(/\d+/g)}`,
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        },
        {
            status: 200,
            expectRequest: {
                keys: productInventoryKey,
            },
            build: {
                object: productInventory,
                alias: "productInventory",
            },
        }
    )

    const checkDate = format(new Date(event.date), "MMM do, yyyy")
    const checkSchedule = format(new Date(event.date), "cccc p")
    cy.dataInContainer("date", checkDate)
    cy.dataInContainer("schedule", checkSchedule)
    cy.dataInContainer("location", event.location)
    cy.dataInContainer("price", `$${event.price}`)
    cy.get("@productInventory").then((product: any) => {
        cy.dataInContainer("inventory-of-entries", `${product.totalInventory} of ${event.entries}`)
    })

    cy.dataInContainer("participate", "Participate")
    cy.dataInContainer("show-viper", `Organized by:${event.organizer.name}`)
    cy.getByData("like-event").should("exist").and("be.visible")
    cy.getByData("comment-event").should("exist").and("be.visible")
})

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
