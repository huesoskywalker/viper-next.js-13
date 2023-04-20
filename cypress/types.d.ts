// reference code is written like below to avoid the clash in mocha types.
// in most of the cases, simple <reference types="cypress" /> will do.
/// <reference path="../../../node_modules/cypress/types/cy-blob-util.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cy-bluebird.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cy-minimatch.d.ts" />
/// <reference path="../../../node_modules/cypress/types/lodash/index.d.ts" />
/// <reference path="../../../node_modules/cypress/types/sinon/index.d.ts" />
/// <reference path="../../../node_modules/cypress/types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cypress.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cypress-type-helpers.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cypress-global-vars.d.ts" />

declare namespace Cypress {
    // add custom Cypress command to the interface Chainable<Subject>

    interface Chainable<Subject = any> {
        getByData(selector: string): Cypress.Chainable
        dataInContainer(selector: string, value: string): Cypress.Chainable
        clickButton(selector: string, contains: string, href?: string): Cypress.Chainable
        inputType(selector: string, value: string): Cypress.Chainable
        inputSelect(selector: string, value: string): Cypress.Chainable

        signInWithCredential(username: string, password: string): Cypress.Chainable

        apiRequestAndResponse(
            requestOptions: {
                url: string
                headers: object
                method: string
                body?: object
            },
            responseOptions: {
                status: number
                expectRequest?: {
                    keys: string[]
                    object?: object | Alias
                    path?: string
                }
                build?: {
                    object: object | Alias
                    alias?: Alias
                }
            }
        ): Cypress.Chainable

        verifyInterceptionRequestAndResponse(
            interception: Interception,
            requestOptions: {
                reqUrl: string
                reqHeaders: object
                reqMethod: string
                reqBody: object | string
            },
            responseOptions: {
                resStatus: number
                resBody: object | string
                resHeaders: object
                resKeys?: string[]
            },
            dataOptions: {
                source: "mongodb" | "shopify"
                action?: "create" | "edit"
            },
            buildProperty?: {
                propKeys: {
                    reqKey: string
                    objKey: string
                }
                propPath?: string
                alias?: string
            }
        ): Cypress.Chainable

        checkEventComponentProps(event: EventInterface): Cypress.Chainable
    }

    // add properties the application adds to its "window" object
    // by adding them to the interface ApplicationWindow
    interface ApplicationWindow {
        // let TS know the application's code will add
        // method window.add with the following signature
        add(a: number, b: number): number
    }
}
