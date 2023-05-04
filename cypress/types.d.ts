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
                    object?: object | Alias<string>
                    path?: string
                }
                build?: {
                    object: object | Alias<string>
                    alias?: Alias<string>
                }
            }
        ): Cypress.Chainable

        expectBodyKeyEqualObjectKey(body: BodyType, object: object | Alias<string>): void

        verifyInterceptionRequestAndResponse(
            interception: Interception,
            requestOptions: {
                reqUrl: string
                reqHeaders: object
                reqMethod: string
                reqBody: object | Alias<string> | (object | Alias<string>)[]
                reqKeys: (string | number)[]
            },
            responseOptions: {
                resStatus: number
                resHeaders: object
                resKeys: (string | number)[] | (string | number)[][]
                resBody?: object | Alias<string> | (object | Alias<string>)[]
            },
            dataOptions:
                | {
                      source: "mongodb" | "shopify"
                      action?: "create" | "edit"
                  }
                | {
                      source: "mongodb" | "shopify"
                      action?: "create" | "edit"
                  }[],
            buildProperty?:
                | {
                      body: "response" | "request"
                      propKeys:
                          | {
                                reqKey: string
                                objKey: string
                            }
                          | {
                                reqKey: string
                                objKey: string
                            }[]
                      object: object | Alias<string> | (object | Alias<string>)[]
                      objPath?: string | (string | undefined)[]
                      alias?: Alias<string> | (Alias<string> | undefined)[]
                  }
                | ({
                      body: "response" | "request"
                      propKeys:
                          | {
                                reqKey: string
                                objKey: string
                            }
                          | {
                                reqKey: string
                                objKey: string
                            }[]
                      object: object | Alias<string> | (object | Alias<string>)[]
                      objPath?: string | (string | undefined)[]
                      alias?: Alias<string> | (Alias<string> | undefined)[]
                  } | null)[]
        ): Cypress.Chainable

        expectInterceptionEqualRequestOptions(
            interception: Interception,
            requestOptions: {
                reqUrl: string
                reqHeaders: object
                reqMethod: string
                reqBody: object | Alias<string> | (object | Alias<string>)[]
                reqKeys: (string | number)[]
            }
        ): void

        expectMongoDBResponse(response: Response, action?: "edit" | "create")

        checkEventComponentProps(event: EventInterface): Cypress.Chainable

        handleBuildProperty(
            body: BodyType,
            buildProperty: {
                propKeys:
                    | {
                          reqKey: string
                          objKey: string
                      }
                    | {
                          reqKey: string
                          objKey: string
                      }[]
                realObject: object | Alias<string> | (object | Alias<string>)[]
                expectProperty: "response" | "request"
                objPath?: string | (string | undefined)[]
                alias?: Alias<string> | (Alias<string> | undefined)[]
            }
        )

        handleAndExpectKeys(
            body: BodyType,
            propKeys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[]
        )

        buildObjectProperties(
            body: BodyType,
            object: object | Alias<string>,
            properties: {
                propKeys?:
                    | {
                          reqKey: string
                          objKey: string
                      }
                    | {
                          reqKey: string
                          objKey: string
                      }[]
                objPath?: string
                alias?: Alias<string>
            }
        )

        isAliasObject(object: BodyType | Alias<string>): Cypress.Chainable

        buildProps(
            body: BodyType,
            object: object,
            properties: {
                propKeys?:
                    | {
                          reqKey: string
                          objKey: string
                      }
                    | {
                          reqKey: string
                          objKey: string
                      }[]
                objPath?: string | undefined
            }
        )

        handleKeys(
            body: object,
            object: object,
            keys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[],
            path: string | undefined
        )

        handlePath(object: object, path: string, value: object)

        handleObject(object: object, value: object)

        // =================
    }
    // add properties the application adds to its "window" object
    // by adding them to the interface ApplicationWindow
    interface ApplicationWindow {
        // let TS know the application's code will add
        // method window.add with the following signature
        add(a: number, b: number): number
    }
}
