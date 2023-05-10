/// <reference types="cypress" />

import { format } from "date-fns"
import _ from "lodash"
import { Session, rawSession } from "./myApp/session"
import { ProductInventory, productInventory, rawEvent, rawEventId } from "./myApp/event"
import { sessionKeys } from "./myApp/sessionKeys"
import { eventKeys, productInventoryKeys } from "./myApp/eventKeys"
import { EventInterface } from "@/types/event"
import { content_type } from "./entryPoint"
import { ID } from "./myApp/viper"
import { viperKeys } from "./myApp/viperKeys"
import { Viper, ViperBasicProps, MyBlog } from "@/types/viper"
import { requestLikeBlogKeys } from "./request/requestKeys"
import { Interception } from "cypress/types/net-stubbing"
import { requestLikeBlog } from "./request/requestObjects"
import { LikeBlog } from "./request/requestTypes"

export {}

export type Alias<T> = {
    [K in keyof T]: `@\${string & T[K]}`
}

export type BodyType = {
    [key: string]: any
}

function isPathInTarget(object: object | string, path: string | undefined) {
    if (!path) return undefined
    const cleanPath = path.replace(/(?:\.\w+|\[\d+\])$/, "")
    return _.has(object, cleanPath) ? cleanPath : undefined
}

Cypress.Commands.add("signInWithCredential", (username: string, password: string) => {
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
                        object: rawSession,
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
})

Cypress.Commands.add("getByData", (selector: string) => {
    return cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add("clickButton", (selector: string, contains: string, href?: string) => {
    if (href) {
        return cy.getByData(selector).contains(contains).should("have.attr", "href", href).click()
    } else {
        return cy.getByData(selector).contains(contains).click()
    }
})

Cypress.Commands.add("navigate", (selector: string, contains: string, href: string) => {
    cy.clickButton(selector, contains, href)
    cy.url().should("include", href)
    cy.visit(href)
})

Cypress.Commands.add("inputType", (selector: string, value: string) => {
    return cy.getByData(selector).clear().type(value)
})

Cypress.Commands.add("inputSelect", (selector: string, value: string) => {
    return cy.getByData(selector).select(value).should("have.value", value)
})

Cypress.Commands.add("dataInContainer", (selector: string, value: string) => {
    return cy.getByData(selector).contains(value).should("be.visible")
})

Cypress.Commands.add("dataInImage", (selector: string, src: string) => {
    cy.getByData(selector).should("have.attr", "src").should("include", src)
    // .and("be.visible")
})

Cypress.Commands.add(
    "apiRequestAndResponse",
    (
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
                alias?: string
            }
        }
    ) => {
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
                const { keys, object: expectObject, path } = expectRequest
                const targetValue = path ? _.get(targetBody, path) : targetBody
                expect(targetValue).to.have.all.keys(keys)
                if (expectObject) {
                    cy.expectBodyKeyEqualObjectKey(targetValue, expectObject)
                }
                if (build) {
                    const { object: buildObject, alias } = build
                    cy.buildObjectProperties(targetValue, buildObject, {
                        objPath: path,
                        alias: alias,
                    })
                }
            } else if (!expectRequest && build) {
                const { object, alias } = build
                cy.buildObjectProperties(targetBody, object, { alias })
            }
        })
    }
)

Cypress.Commands.add(
    "expectBodyKeyEqualObjectKey",
    (body: BodyType, object: object | Alias<string>) => {
        cy.isAliasObject(object).then((realObject: any) => {
            Object.keys(realObject).forEach((key: any) => {
                expect(body[key]).to.deep.equal(realObject[key])
            })
        })
    }
)

Cypress.Commands.add("buildEventFromUrlAndCheckComponent", (alias: string) => {
    cy.url()
        .should((url) => {
            expect(url).to.match(/\/[a-f\d]{24}$/)
        })
        .then((url) => {
            const id = {
                _id: url.split("/").pop(),
            }
            if (id)
                cy.buildObjectProperties(id, rawEventId, {
                    propKeys: {
                        reqKey: "_id",
                        objKey: "_id",
                    },
                    alias: `${alias}Id`,
                })
        })
    cy.get<ID>(`@${alias}Id`).then((event: ID) => {
        cy.apiRequestAndResponse(
            {
                url: `/api/event/${event._id}`,
                headers: {
                    "content-type": content_type,
                },
                method: "GET",
            },
            {
                status: 200,
                expectRequest: {
                    keys: eventKeys,
                    object: { _id: event._id },
                },
                build: {
                    object: rawEvent,
                    alias: alias,
                },
            }
        )
    })
    cy.get<EventInterface>(`@${alias}`).then((event: EventInterface) => {
        cy.checkEventComponentProps(event)
    })
})

Cypress.Commands.add(
    "likeEventAndVerifyEndpoints",
    (resBody: (EventInterface | Alias<string>) & (Viper | Alias<string>)[]) => {
        const event = resBody[0]
        const viper = resBody[1]
        cy.isAliasObject(event).then((event: EventInterface) => {
            cy.isAliasObject(viper).then((viper: Viper) => {
                cy.intercept(`/api/event/like`).as("like-event")
                cy.getByData("like-event").click()
                cy.wait("@like-event").then((interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/event/like`,
                            reqMethod: "POST",
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqBody: [
                                { event: { _id: event._id } },
                                { viper: { _id: viper._id } },
                            ],
                            reqKeys: ["event", "viper"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: [eventKeys, viperKeys],
                            resBody: [event, viper],
                        },
                        [
                            {
                                source: "mongodb",
                                action: "edit",
                            },
                            {
                                source: "mongodb",
                                action: "edit",
                            },
                        ],
                        [
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "viper._id",
                                    objKey: "_id",
                                },
                                object: event,
                                objPath: "likes[0]",
                            },
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "event._id",
                                    objKey: "_id",
                                },
                                object: viper,
                                objPath: "myEvents.likes[0]",
                            },
                        ]
                    )
                })
                cy.apiRequestAndResponse(
                    {
                        url: `/api/event/${event._id}`,
                        method: "GET",
                        headers: {
                            "content-type": content_type,
                        },
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: ["_id"],
                            object: { _id: viper._id },
                            path: "likes[0]",
                        },
                    }
                )
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${viper._id}`,
                        method: "GET",
                        headers: {
                            "content-type": content_type,
                        },
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: ["_id"],
                            object: { _id: event._id },
                            path: "myEvents.likes[0]",
                        },
                    }
                )
            })
        })
    }
)

Cypress.Commands.add(
    "verifyInterceptionRequestAndResponse",
    (
        interception,
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
                  alias?: string | (string | undefined)[]
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
                  alias?: string | (string | undefined)[]
              } | null)[]
    ) => {
        const {
            statusCode: statusCode,
            headers: responseHeaders,
            body: responseBody,
        } = interception.response
        const { resStatus, resHeaders, resBody, resKeys } = responseOptions
        const { body: requestBody } = interception.request

        const isResponseBodyArray = Array.isArray(responseBody)
        const isResKeysArray = Array.isArray(resKeys)
        const isResBodyArray = Array.isArray(resBody)
        const isDataOptionsArray = Array.isArray(dataOptions)
        const isBuildPropertyArray = Array.isArray(buildProperty)

        if (
            isResponseBodyArray &&
            isResKeysArray &&
            isResBodyArray &&
            isDataOptionsArray &&
            isBuildPropertyArray
        ) {
            for (let i = 0; i < responseBody.length; i++) {
                const { source, action } = dataOptions[i]
                const isMongoEditDoc = source === "mongodb" && action === "edit"
                const document = isMongoEditDoc ? responseBody[i].value : responseBody[i]
                cy.expectInterceptionEqualRequestOptions(interception.request, requestOptions)
                expect(statusCode).to.equal(resStatus)
                expect(responseHeaders).to.include(resHeaders)
                expect(document).to.have.all.keys(resKeys[i])

                if (resBody[i]) {
                    cy.expectBodyKeyEqualObjectKey(document, resBody[i])
                }

                cy.expectMongoDBResponse(responseBody[i], action)

                if (buildProperty[i]) {
                    const { body, propKeys, object, objPath, alias } = buildProperty[i]!
                    const buildProps = {
                        propKeys,
                        realObject: object,
                        expectProperty: body,
                        objPath,
                        alias,
                    }

                    const bodyValue = body === "response" ? document : requestBody
                    cy.handleBuildProperty(bodyValue, buildProps)
                }
            }
        } else if (!isDataOptionsArray) {
            const { source, action } = dataOptions
            const isMongoEditDoc = source === "mongodb" && action === "edit"
            const responseValue = isMongoEditDoc ? responseBody.value : responseBody

            expect(statusCode).to.equal(resStatus)
            expect(responseHeaders).to.include(resHeaders)
            expect(responseValue).to.have.all.keys(resKeys)
            cy.expectInterceptionEqualRequestOptions(interception.request, requestOptions)
            if (resBody) {
                cy.expectBodyKeyEqualObjectKey(responseValue, resBody)
            }
            if (source === "mongodb") {
                cy.expectMongoDBResponse(responseBody, action)
            }
            if (buildProperty && !isBuildPropertyArray) {
                const { body, propKeys, object, objPath, alias } = buildProperty
                const bodyValue = body === "response" ? responseValue : requestBody
                const buildProps = {
                    propKeys,
                    expectProperty: body,
                    realObject: object,
                    objPath,
                    alias,
                }
                cy.handleBuildProperty(bodyValue, buildProps)
            }
        }
    }
)

Cypress.Commands.add(
    "expectInterceptionEqualRequestOptions",
    (
        interceptionRequest,
        requestOptions: {
            reqUrl: string
            reqHeaders: object
            reqMethod: string
            reqBody: object | Alias<string> | (object | Alias<string>)[]
            reqKeys: (string | number)[]
        }
    ) => {
        const {
            url: requestUrl,
            method: requestMethod,
            headers: requestHeaders,
            body: requestBody,
        } = interceptionRequest
        const { reqUrl, reqHeaders, reqMethod, reqBody, reqKeys } = requestOptions
        expect(requestUrl).to.include(reqUrl)
        expect(requestMethod).to.equal(reqMethod)
        expect(requestHeaders).to.include(reqHeaders)
        expect(requestBody).to.have.all.keys(reqKeys)
        if (Array.isArray(reqBody)) {
            reqBody.forEach((body) => {
                cy.expectBodyKeyEqualObjectKey(requestBody, body)
            })
        } else {
            cy.expectBodyKeyEqualObjectKey(requestBody, reqBody)
        }
    }
)

Cypress.Commands.add("expectMongoDBResponse", (response, action?: "edit" | "create") => {
    if (action === "edit") {
        expect(response.ok).to.equal(1)
        expect(response.lastErrorObject.n).to.equal(1)
        expect(response.lastErrorObject.updatedExisting).to.equal(true)
    } else {
        expect(response.acknowledged).to.equal(true)
    }
})

Cypress.Commands.add("checkEventComponentProps", (event: EventInterface) => {
    cy.apiRequestAndResponse(
        {
            url: `/api/event/${event._id}`,
            headers: {
                "content-type": content_type,
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
    cy.dataInImage("image", event.image)
    cy.dataInContainer("title", event.title)
    cy.dataInContainer("content", event.content)
    cy.dataInContainer("address", event.address)

    cy.apiRequestAndResponse(
        {
            url: `/api/product/inventory/${event.product._id.toString().match(/\d+/g)}`,
            headers: {
                "content-type": content_type,
            },
            method: "POST",
        },
        {
            status: 200,
            expectRequest: {
                keys: productInventoryKeys,
            },
            build: {
                object: productInventory,
                alias: "productInventory",
            },
        }
    )

    const checkDate = format(new Date(event.date.split("T")[0]), "MMM do, yyyy")
    const checkSchedule = format(new Date(event.date.split("T")[0]), "cccc p")
    cy.dataInContainer("event-date", checkDate)
    cy.dataInContainer("event-schedule", checkSchedule)
    cy.dataInContainer("event-location", event.location)
    cy.dataInContainer("event-price", `$${event.price}`)
    cy.get<ProductInventory>("@productInventory").then((product) => {
        cy.dataInContainer("inventory-of-entries", `${product.totalInventory} of ${event.entries}`)
    })

    cy.getByData("participate").should("exist").and("be.visible")
    cy.dataInContainer("show-viper", `Organized by:${event.organizer.name}`)
    cy.getByData("like-event").should("exist").and("be.visible")
    cy.getByData("comment-event").should("exist").and("be.visible")
})

Cypress.Commands.add("checkCollectionEventCard", (event: EventInterface | Alias<string>) => {
    cy.isAliasObject(event).then((realEvent: EventInterface) => {
        cy.dataInImage("event-image", realEvent.image)
        cy.dataInContainer("event-title", realEvent.title)
        cy.dataInContainer("event-location", realEvent.location)
        const checkDate = format(new Date(realEvent.date.split("T")[0]), "MMM do, yyyy")
        cy.dataInContainer("event-date", checkDate)
    })
})

Cypress.Commands.add(
    "checkProfileComponent",
    (
        viper: Viper | ViperBasicProps | Alias<string>,
        button: "Edit Profile" | "Follow" | "Following"
    ) => {
        cy.isAliasObject(viper).then((realViper: Viper | ViperBasicProps) => {
            cy.dataInImage("profile-image", realViper.image)
            cy.dataInImage("background-image", realViper.backgroundImage)
            cy.dataInContainer("viper-name", realViper.name)
            cy.dataInContainer("viper-location", realViper.location)
            cy.dataInContainer("viper-biography", realViper.biography)
            cy.getByData("display-show-follow").eq(0).should("exist").and("be.visible")
            cy.getByData("display-show-follow").eq(1).should("exist").and("be.visible")
            cy.dataInContainer("display-add-follow", button)
        })
    }
)

Cypress.Commands.add(
    "checkCommentCardComponent",
    (viper: Viper | ViperBasicProps | Session, blog: MyBlog, request?: string) => {
        const value = request ? request : blog.content
        cy.dataInImage("blog-viper-image", viper.image)
        cy.dataInContainer("blog-viper-name", viper.name)
        cy.dataInContainer("comment-timestamp", format(blog.timestamp, "MMM d, yyyy"))
        cy.getByData("blog-comment").eq(0).should("contain", value)
    }
)

Cypress.Commands.add("likeCommentCard", (blog: MyBlog, profiles: (Viper | Alias<string>)[]) => {
    const regex = /\/[a-f\d]{24}$/
    cy.intercept("POST", `/api/viper/blog/like`).as("like-blog")
    cy.getByData("like-blog").eq(0).click()

    cy.url().then((url) => {
        cy.get<Session>("@session").then((session: Session) => {
            if (regex.test(url)) {
                const id = url.split("/").pop()
                cy.wrap<LikeBlog>(requestLikeBlog)
                    .then((likeRequest: LikeBlog) => {
                        likeRequest._id = blog._id
                        likeRequest.blogOwner_id = id
                        likeRequest.viper_id = session._id
                        return likeRequest
                    })
                    .as("requestLikeBlog")
            } else {
                cy.wrap<LikeBlog>(requestLikeBlog)
                    .then((likeRequest: LikeBlog) => {
                        likeRequest._id = blog._id
                        likeRequest.blogOwner_id = session._id
                        likeRequest.viper_id = session._id
                        return likeRequest
                    })
                    .as("requestLikeBlog")
            }
        })

        const blogOwner = profiles[0]
        const viper = profiles[1]
        cy.wait("@like-blog").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/viper/blog/like`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: "@requestLikeBlog",
                    reqKeys: [...requestLikeBlogKeys, "timestamp"],
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: [viperKeys, viperKeys],
                    resBody: [blogOwner, viper],
                },
                [
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                ],
                [
                    {
                        body: "request",
                        propKeys: {
                            reqKey: "viper_id",
                            objKey: "_id",
                        },
                        object: blogOwner,
                        objPath: `blog.myBlog[0].likes[0]`,
                    },
                    {
                        body: "request",
                        propKeys: [
                            {
                                reqKey: "blogOwner_id",
                                objKey: "blogOwner_id",
                            },
                            {
                                reqKey: "_id",
                                objKey: "_id",
                            },
                            {
                                reqKey: "viper_id",
                                objKey: "viper_id",
                            },
                            {
                                reqKey: "timestamp",
                                objKey: "timestamp",
                            },
                        ],
                        object: viper,
                        objPath: "blog.likes[0]",
                    },
                ]
            )
        })
        // type RequestOrResponse = "request" | "response"

        // type PropKeys =
        //     | {
        //           reqKey: string
        //           objKey: string
        //       }
        //     | {
        //           reqKey: string
        //           objKey: string
        //       }[]
        // type BuildProfileItem = {
        //     body: RequestOrResponse
        //     propKeys: PropKeys
        //     object: Viper | Alias<string>
        //     objPath?: string | (string | undefined)[] | undefined
        //     alias?: string
        // }

        // type BuildProfile = (BuildProfileItem | null)[]
        // const buildProfile: BuildProfile = regex.test(url)
        //     ? [
        //           {
        //               body: "request",
        //               propKeys: {
        //                   reqKey: "viper_id",
        //                   objKey: "_id",
        //               },
        //               object: blogOwner,
        //               objPath: `blog.myBlog[0].likes[0]`,
        //           },
        //           {
        //               body: "request",
        //               propKeys: {
        //                   reqKey: "viper_id",
        //                   objKey: "_id",
        //               },
        //               object: "@profile",
        //               objPath: `blog.myBlog[0].likes[0]`,
        //           },
        //       ]
        //     : [
        //           {
        //               body: "request",
        //               propKeys: {
        //                   reqKey: "viper_id",
        //                   objKey: "_id",
        //               },
        //               object: blogOwner,
        //               objPath: `blog.myBlog[0].likes[0]`,
        //           },
        //           {
        //               body: "request",
        //               propKeys: [
        //                   {
        //                       reqKey: "blogOwner_id",
        //                       objKey: "blogOwner_id",
        //                   },
        //                   {
        //                       reqKey: "_id",
        //                       objKey: "_id",
        //                   },
        //                   {
        //                       reqKey: "viper_id",
        //                       objKey: "viper_id",
        //                   },
        //                   {
        //                       reqKey: "timestamp",
        //                       objKey: "timestamp",
        //                   },
        //               ],
        //               object: viper,
        //               objPath: "blog.likes[0]",
        //           },
        //       ]
    })
})

Cypress.Commands.add(
    "handleBuildProperty",
    (
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
            alias?: string | (string | undefined)[]
        }
    ) => {
        const { propKeys, realObject, expectProperty, objPath, alias } = buildProperty

        if (expectProperty === "response") {
            cy.handleAndExpectKeys(body, propKeys)
        }

        const isObjectArray = Array.isArray(realObject)
        const isAliasArray = Array.isArray(alias)
        const isPathArray = Array.isArray(objPath)

        if (isObjectArray && isAliasArray && isPathArray) {
            for (let i = 0; i < realObject.length && alias.length && objPath.length; i++) {
                const object = realObject[i]
                const objAlias = alias[i]
                const path = objPath[i]
                const wrapProperties = { propKeys, objPath: path, alias: objAlias }
                cy.buildObjectProperties(body, object, wrapProperties)
            }
        } else if (isObjectArray && isAliasArray && !isPathArray) {
            for (let i = 0; i < realObject.length && alias.length; i++) {
                const object = realObject[i]
                const objAlias = alias[i]
                const path = objPath
                const wrapProperties = { propKeys, objPath: path, alias: objAlias }
                cy.buildObjectProperties(body, object, wrapProperties)
            }
        } else if (!isObjectArray && !isAliasArray && !isPathArray) {
            const properties = { propKeys, objPath, alias }
            cy.buildObjectProperties(body, realObject, properties)
        } else if (isObjectArray && !alias && !isPathArray) {
            const properties = { propKeys, objPath }
            cy.buildObjectProperties(body, realObject, properties)
        }
    }
)

Cypress.Commands.add(
    "handleAndExpectKeys",
    (
        body: BodyType,
        propKeys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[]
    ) => {
        if (Array.isArray(propKeys)) {
            propKeys.forEach((keyPair) => {
                const { reqKey, objKey } = keyPair
                const [parentKey, ...childKeys] = reqKey.split(".")
                if (childKeys.length) {
                    const childKey = childKeys.join(".")
                    expect(body[parentKey]).to.have.deep.property(childKey)
                } else {
                    expect(body).to.have.deep.property(parentKey)
                }
            })
        } else {
            const { reqKey, objKey } = propKeys
            const [parentKey, ...childKeys] = reqKey.split(".")
            if (childKeys.length) {
                const childKey = childKeys.join(".")
                expect(body[parentKey]).to.have.deep.property(childKey)
            } else {
                expect(body).to.have.deep.property(parentKey)
            }
        }
    }
)

Cypress.Commands.add(
    "buildObjectProperties",
    (
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
            alias?: string
        }
    ) => {
        const { propKeys, objPath, alias } = properties

        const objectProps = { propKeys, objPath }
        if (alias && typeof object === "object") {
            cy.wrap(object)
                .then((object) => {
                    cy.buildProps(body, object, objectProps)
                })
                .as(alias)
        } else {
            cy.isAliasObject(object).then((realObject) => {
                cy.buildProps(body, realObject, objectProps)
            })
        }
    }
)

Cypress.Commands.add("isAliasObject", (object: BodyType | Alias<string>) => {
    const result: any = {}

    if (typeof object === "string" && object.startsWith("@")) {
        cy.get(`${object}`).then((realObject) => {
            return realObject
        })
    } else if (typeof object === "object") {
        Object.keys(object).forEach((key) => {
            if (typeof object[key] === "string" && object[key].startsWith("@")) {
                cy.get(`${object[key]}`).then((realObj) => {
                    result[key] = realObj
                })
            } else if (
                typeof object[key] === "object" &&
                !Array.isArray(object[key]) &&
                object[key] !== null
            ) {
                cy.isAliasObject(object[key]).then((realObj) => {
                    result[key] = realObj
                })
            } else {
                result[key] = object[key]
            }
        })
        return cy.wrap(result)
    }
})

Cypress.Commands.add(
    "buildProps",
    (
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
    ) => {
        const { propKeys, objPath } = properties

        if (propKeys) {
            cy.handleKeys(body, object, propKeys, objPath)
        } else if (objPath) {
            if (isPathInTarget(object, objPath)) {
                cy.handlePath(object, objPath, body)
            } else {
                cy.handleObject(object, body)
            }
        } else {
            cy.handleObject(object, body)
        }
    }
)

Cypress.Commands.add(
    "handleKeys",
    (
        body: object,
        object: object,
        keys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[],
        path: string | undefined
    ) => {
        const propertyValues: { [key: string]: any } = {}

        if (Array.isArray(keys)) {
            keys.forEach((keyPair) => {
                const { reqKey, objKey } = keyPair
                propertyValues[objKey] = _.get(body, reqKey)
            })
        } else {
            const { objKey, reqKey } = keys
            propertyValues[objKey] = _.get(body, reqKey)
        }
        if (path) {
            if (isPathInTarget(object, path)) {
                cy.handlePath(object, path, propertyValues)
            } else {
                const bodyValue = _.get(body, path)
                cy.handleObject(object, bodyValue)
            }
        } else {
            cy.handleObject(object, propertyValues)
        }
    }
)

Cypress.Commands.add("handlePath", (object: object, path: string, value: object) => {
    _.update(object, path, (currentValue) => {
        const action = Array.isArray(currentValue)
            ? _.concat(currentValue, value)
            : { ...currentValue, ...value }
        return action
    })
    return object
})

Cypress.Commands.add("handleObject", (object: object, value: object) => {
    Object.assign(object, value)
    return object
})

// Cypress.Commands.add("buildViperBasicProps", (_id: string, alias: string) => {
// cy.apiRequestAndResponse(
// {
// url: `/api/viper/${_id}?props=basic-props`,
// method: "GET",
// headers: {
// "content-type": content_type,
// },
// },
// {
// status: 200,
// expectRequest: {
// keys: viperBasicKeys,
// object: { _id: _id },
// },
// build: {
// object: rawViperBasicProps,
// alias: alias,
// },
// }
// )
// })

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
