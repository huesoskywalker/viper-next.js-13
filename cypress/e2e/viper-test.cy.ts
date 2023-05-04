/* global window */
/// <reference path="../types.d.ts" />

import {
    username,
    password,
    content_type,
    userEmail,
    firstName,
    lastName,
} from "../support/entryPoint"
import { rawEvent, rawEventId, rawProduct } from "../support/myApp/event"
import { rawViper, myBlog, rawViperId, ID } from "../support/myApp/viper"
import {
    responseCheckoutId,
    responseCheckoutWebUrl,
    responseCustomerShopify,
    responseProductMedia,
    responsePublishProduct,
} from "../support/response/responseObjects"
import {
    typeDate,
    typeTime,
    requestCreateEvent,
    requestEditProfile,
    requestEditEvent,
    requestCreateBlog,
    requestLikeBlog,
    requestEventImage,
    requestProductMedia,
    requestCustomerAddress,
    requestProductShopify,
} from "../support/request/requestObjects"
import {
    requestLikeBlogKeys,
    requestEditProfileKeys,
    requestCreateEventKeys,
    requestEventImageKeys,
    requestProductMediaKeys,
    requestCreateBlogKeys,
    requestEditEventKeys,
    requestProductShopifyKeys,
} from "../support/request/requestKeys"
import {
    responseNewEventKeys,
    responseProductMediaKeys,
    responsePublishProductKeys,
    responseStageUploadKeys,
    responseNewCustomerKeys,
    responseCustomerAddressKeys,
    responseCheckoutCreateKeys,
    responseCheckoutCustomerAssociateKeys,
    responseCustomerShopifyKeys,
} from "../support/response/responseKeys"
import { _idKey, externalBlogKeys, myBlogKeys, viperKeys } from "../support/myApp/viperKeys"
import { eventKeys } from "../support/myApp/eventKeys"
import { sessionKeys } from "../support/myApp/sessionKeys"
import { CustomerShopify } from "../support/response/responseTypes"
import { Session } from "../support/myApp/session"
import { MyBlog, Viper } from "@/types/viper"
import { EventInterface, Product } from "@/types/event"
import { Interception } from "cypress/types/net-stubbing"
import { LikeBlog } from "../support/request/requestTypes"

export {}

describe("Profile Page", () => {
    beforeEach(() => {
        cy.signInWithCredential(username, password)
        cy.visit("/")
    })
    context("Interacts in  the Profile Page", () => {
        it("Creates a blog", () => {
            cy.log(`Profile`)

            cy.get<Session>("@session").then((session: Session) => {
                console.log(`==========session`)
                console.log(session._id)
                console.log(session)
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${session._id}`,
                        headers: {
                            "content-type": content_type,
                        },
                        method: "GET",
                    },
                    {
                        status: 200,

                        expectRequest: {
                            keys: viperKeys,
                            object: session,
                        },
                        build: {
                            object: rawViper,
                            alias: "profile",
                        },
                    }
                )
                cy.buildObjectProperties(session, rawViperId, {
                    propKeys: {
                        reqKey: "_id",
                        objKey: "_id",
                    },
                    alias: "viperId",
                })
                cy.clickButton("nav-item", session.name)
                cy.url().should("include", "/profile")
                cy.clickButton("edit-profile", "Edit Profile")
                cy.url().should("include", `/profile/edit/${session._id}`)
            })
            cy.inputType("new-name", requestEditProfile.name)
            cy.inputType("new-biography", requestEditProfile.biography)
            cy.intercept("PUT", "/api/viper/profile-image").as("profile-image")
            cy.getByData("new-profile-image").selectFile([
                {
                    contents: "cypress/fixtures/images/myprofile.jpeg",
                    fileName: "myprofile.jpeg",
                    mimeType: "image/jpeg",
                    lastModified: new Date("Feb 18 2023").valueOf(),
                },
            ])
            cy.fixture("/images/myprofile.jpeg", "base64").as("profileImage")
            cy.getByData("accept-profile-image").click()
            cy.intercept("PUT", "/api/viper/background-image").as("background-image")
            cy.getByData("new-background-image").selectFile([
                {
                    contents: "cypress/fixtures/images/jam-session.jpeg",
                    fileName: "jam-session.jpeg",
                    mimeType: "image/jpeg",
                    lastModified: new Date("Feb 18 2023").valueOf(),
                },
            ])

            cy.inputSelect("new-location", requestEditProfile.location)
            cy.intercept("PUT", `/api/viper/edit`).as("edit-viper")
            cy.clickButton("submit-button", "Edit")
            // ===============LEAVE THIS DOUBLE WAIT==========================
            cy.wait("@profile-image")
            cy.wait("@profile-image").then((interception: Interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                expect(statusCode).eq(200)
                expect(responseBody.data.url).to.be.a("string")

                cy.buildObjectProperties(responseBody, requestEditProfile, {
                    propKeys: {
                        reqKey: "data.url",
                        objKey: "image",
                    },
                    alias: "requestEditProfile",
                })
            })
            cy.wait("@background-image").then((interception: Interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                expect(statusCode).eq(200)
                expect(responseBody.bgData.url).to.be.a("string")
                cy.buildObjectProperties(responseBody, "@requestEditProfile", {
                    propKeys: {
                        reqKey: "bgData.url",
                        objKey: "backgroundImage",
                    },
                })
            })
            cy.wait("@edit-viper").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/viper/edit`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "PUT",
                        reqBody: "@requestEditProfile",
                        reqKeys: [..._idKey, ...requestEditProfileKeys],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: viperKeys,
                        resBody: "@profile",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    }
                )
                cy.get<Session>("@session").then((session: Session) => {
                    cy.apiRequestAndResponse(
                        {
                            url: `/api/viper/${session._id}`,
                            headers: {
                                "content-type": content_type,
                            },
                            method: "GET",
                        },
                        {
                            status: 200,
                            expectRequest: {
                                keys: viperKeys,
                                object: "@requestEditProfile",
                            },
                            build: {
                                object: "@profile",
                            },
                        }
                    )
                })
            })
            cy.url().should("include", "/profile")
            cy.get<Viper>("@profile").then((viper: Viper) => {
                cy.getByData("profileImage").should("be.visible")
                cy.getByData("backgroundImage").should("be.visible")
                cy.dataInContainer("name", viper.name)
                cy.dataInContainer("location", viper.location)
                cy.dataInContainer("biography", viper.biography)
            })

            // ======================BLOG=====================TEST CAN BE PERFORM BETTER IN HERE============================

            cy.clickButton("blog-button", "Let's Blog")
            cy.getByData("commentInput").should("exist")
            cy.inputType("add-comment", requestCreateBlog.content)
            cy.intercept("POST", `/api/viper/blog/create`).as("create-blog")
            cy.clickButton("post-blog", "Comment")
            cy.wait("@create-blog").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/viper/blog/create`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: ["@viperId", requestCreateBlog],
                        reqKeys: [..._idKey, ...requestCreateBlogKeys],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: viperKeys,
                        resBody: "@profile",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    }
                )
            })

            cy.getByData("commentInput").should("not.exist")

            cy.get<Viper>("@profile").then((viper: Viper) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/blog/all`,
                        headers: {
                            "content-type": content_type,
                        },
                        method: "POST",
                        body: {
                            viper_id: viper._id,
                        },
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: myBlogKeys,
                            object: requestCreateBlog,
                        },
                        build: {
                            object: myBlog,
                            alias: "myBlog",
                        },
                    }
                )
            })

            cy.get<Session>("@session").then((session: Session) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${session._id}`,
                        headers: {
                            "content-type": content_type,
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: myBlogKeys,
                            object: "@myBlog",
                            path: "blog.myBlog[0]",
                        },
                        build: {
                            object: "@profile",
                        },
                    }
                )
                cy.dataInContainer("blog-viperName", session.name)
            })
            cy.getByData("success-blog").eq(0).should("contain", requestCreateBlog.content)
            cy.log("Success creating a Blog")
            cy.intercept("POST", `/api/viper/blog/like`).as("like-blog")
            cy.getByData("like-blog").eq(0).click()

            cy.url().then((url) => {
                cy.get<MyBlog>("@myBlog").then((blog: MyBlog) => {
                    cy.get<Session>("@session").then((session: Session) => {
                        const regex = /\/[a-f\d]{24}$/
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
                })
            })
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
                        reqKeys: requestLikeBlogKeys,
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: [viperKeys, viperKeys],
                        resBody: ["@profile", "@profile"],
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
                            object: "@profile",
                            objPath: `blog.myBlog[0].likes[0]`,
                        },
                        null,
                    ]
                )
            })

            cy.get<Session>("@session").then((session: Session) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${session._id}`,
                        headers: {
                            "content-type": content_type,
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: externalBlogKeys,
                            object: "@requestLikeBlog",
                            path: "blog.likes[0]",
                        },
                        build: {
                            object: "@profile",
                        },
                    }
                )
            })

            cy.getByData("like-blog")
                .eq(0)
                .invoke("css", "color")
                .should("equal", "rgb(185, 28, 28)")
            cy.getCookies().then((cookies) => {
                expect(cookies[2]).to.have.property("value", "red")
            })

            cy.log("Successful Profile ")

            cy.log(`Dashboard`)

            cy.clickButton("nav-item", "Dashboard", "/dashboard")
            cy.url().should("include", "/dashboard")
            cy.clickButton("tab-item", "My Events", "/dashboard/myevents")
            cy.url().should("include", "/dashboard/myevents")
            cy.clickButton("tab-item", "Create Event", `${"/dashboard/myevents/create"}`)

            cy.url().should("include", "/dashboard/myevents/create")
            cy.inputType("title", requestCreateEvent.title)
            cy.inputType("content", requestCreateEvent.content)
            cy.inputSelect("category", requestCreateEvent.category)
            cy.inputType("date", typeDate)
            cy.inputType("time", typeTime)
            cy.inputSelect("location", requestCreateEvent.location)
            cy.inputType("address", requestCreateEvent.address)
            cy.intercept("POST", "/api/event/create/upload-image").as("event-image")
            cy.getByData("image").selectFile([
                {
                    contents: "cypress/fixtures/images/jam-session.jpeg",
                    fileName: "jam-session.jpeg",
                    mimeType: "image/jpeg",
                    lastModified: new Date("Feb 18 2023").valueOf(),
                },
            ])
            cy.inputType("price", `${requestCreateEvent.price}`)
            cy.inputType("entries", `${requestCreateEvent.entries}`)

            cy.intercept("POST", `/api/product/stage-upload`).as("stage-upload")
            cy.intercept("POST", `/api/product/create-shopify`).as("create-shopify")
            cy.intercept("POST", `/api/product/create-media`).as("product-media")
            cy.intercept("POST", `/api/product/publish-shopify`).as("publish-product")
            cy.intercept("POST", `/api/event/create/submit`).as("create-event")
            cy.clickButton("create-event", "Create Event")

            cy.get<Session>("@session").then((session: Session) => {
                cy.buildObjectProperties(session, requestCreateEvent, {
                    propKeys: [
                        { reqKey: "_id", objKey: "_id" },
                        { reqKey: "name", objKey: "name" },
                        { reqKey: "email", objKey: "email" },
                    ],
                    objPath: "organizer",
                    alias: "requestCreateEvent",
                })

                cy.buildObjectProperties(session, requestProductShopify, {
                    propKeys: {
                        reqKey: "_id",
                        objKey: "organizer",
                    },
                    alias: "requestProductShopify",
                })
            })

            cy.wait("@event-image").then((interception: Interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                expect(statusCode).eq(200)
                expect(responseBody.data).to.exist
                cy.buildObjectProperties(responseBody, requestEventImage, {
                    propKeys: {
                        reqKey: "data",
                        objKey: "data",
                    },
                    alias: "requestEventImage",
                })
                cy.buildObjectProperties(responseBody, "@requestCreateEvent", {
                    propKeys: {
                        reqKey: "data.url",
                        objKey: "image",
                    },
                })
            })
            cy.wait("@stage-upload").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/stage-upload`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: "@requestEventImage",
                        reqKeys: requestEventImageKeys,
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseStageUploadKeys,
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: {
                            reqKey: `stageUpload.resourceUrl`,
                            objKey: `resourceUrl`,
                        },
                        object: ["@requestProductShopify", requestProductMedia],
                        alias: [undefined, "requestProductMedia"],
                    }
                )
            })
            cy.wait("@create-shopify").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/create-shopify`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: "@requestProductShopify",
                        reqKeys: requestProductShopifyKeys,
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: ["product"],
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: [
                            {
                                reqKey: "product._id",
                                objKey: "_id",
                            },
                            {
                                reqKey: "product.variant_id",
                                objKey: "variant_id",
                            },
                        ],
                        object: [
                            { product: rawProduct },
                            "@requestProductMedia",
                            "@requestCreateEvent",
                        ],
                        objPath: "product",
                        alias: ["eventProduct", undefined, undefined],
                    }
                )
            })

            cy.wait("@product-media").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/create-media`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: "@requestProductMedia",
                        reqKeys: requestProductMediaKeys,
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseProductMediaKeys,
                        resBody: responseProductMedia,
                    },
                    {
                        source: "shopify",
                    }
                )
            })

            cy.wait("@publish-product").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/publish-shopify`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: "@eventProduct",
                        reqKeys: ["product"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responsePublishProductKeys,
                        resBody: responsePublishProduct,
                    },
                    {
                        source: "shopify",
                    }
                )
            })

            cy.wait("@create-event").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/event/create/submit`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: "@requestCreateEvent",
                        reqKeys: requestCreateEventKeys,
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: [responseNewEventKeys, viperKeys],
                        resBody: [undefined, "@profile"],
                    },
                    [
                        {
                            source: "mongodb",
                            action: "create",
                        },
                        {
                            source: "mongodb",
                            action: "edit",
                        },
                    ],
                    [
                        {
                            body: "response",
                            propKeys: {
                                reqKey: "insertedId",
                                objKey: "_id",
                            },
                            object: rawEventId,
                            alias: "createdEventId",
                        },
                        null,
                    ]
                )
            })

            cy.get<ID>("@createdEventId").then((createdEvent: ID) => {
                cy.buildObjectProperties(createdEvent, "@profile", {
                    propKeys: {
                        reqKey: "_id",
                        objKey: "_id",
                    },
                    objPath: "myEvents.created[0]",
                })

                cy.apiRequestAndResponse(
                    {
                        url: `/api/event/${createdEvent._id}`,
                        headers: {
                            "content-type": content_type,
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: eventKeys,
                            object: "@requestCreateEvent",
                        },
                        build: {
                            object: rawEvent,
                            alias: "newEvent",
                        },
                    }
                )
            })

            cy.clickButton("preview-button", "Preview")
            cy.window().scrollTo("bottom")
            cy.get<EventInterface>("@newEvent").then((event: EventInterface) => {
                cy.checkEventComponentProps(event)
            })
            cy.window().scrollTo("top")
            cy.clickButton("tab-item", "My Events", "/dashboard/myevents")
            cy.url().should("include", "/dashboard/myevents")
            cy.log("Event Card")
            cy.getByData("display-events").should("exist")
            cy.get<Session>("@session").then((session: Session) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/events/created`,
                        headers: {
                            "content-type": content_type,
                        },
                        method: "POST",
                        body: {
                            viperId: session._id,
                        },
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: eventKeys,
                            object: "@newEvent",
                        },
                    }
                )
            })

            cy.getByData("display-events").should("exist").and("be.visible").first()
            cy.getByData("event-card-image").should("exist").and("be.visible").first()

            cy.get<EventInterface>("@newEvent").then((event: EventInterface) => {
                cy.dataInContainer("event-card-title", event.title).eq(0)
                cy.dataInContainer("event-card-content", event.content).eq(0)
                cy.dataInContainer("event-card-location", event.location).eq(0)
                cy.getByData("event-show-time").should("exist").and("be.visible").eq(0)
                cy.clickButton("edit", "Edit", `/dashboard/myevents/${event._id}`).eq(0)
                cy.url().should("include", `/dashboard/myevents/${event._id}`)
            })

            cy.inputType("event-title", `${requestEditEvent.title}`)
            cy.inputType("event-content", `${requestEditEvent.content}`)
            cy.inputSelect("event-location", `${requestEditEvent.location}`)
            cy.inputType("event-price", `${requestEditEvent.price}`)
            cy.intercept("PUT", `/api/event/create/submit`).as("edit-event")
            cy.clickButton("edit-event-button", "Submit Edition")

            cy.wait("@edit-event").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/event/create/submit`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "PUT",
                        reqBody: requestEditEvent,
                        reqKeys: ["dateNow", ...requestEditEventKeys],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: eventKeys,
                        resBody: "@newEvent",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                    {
                        body: "request",
                        propKeys: [
                            {
                                reqKey: "dateNow",
                                objKey: "editionDate",
                            },
                            {
                                reqKey: "title",
                                objKey: "title",
                            },
                            {
                                reqKey: "content",
                                objKey: "content",
                            },
                            {
                                reqKey: "location",
                                objKey: "location",
                            },
                            {
                                reqKey: "price",
                                objKey: "price",
                            },
                        ],
                        object: "@newEvent",
                    }
                )
            })
            cy.url()
                .should((url) => {
                    expect(url).to.match(/\/[a-f\d]{24}$/)
                })
                .then((url) => {
                    const eventId = url.split("/").pop()

                    cy.apiRequestAndResponse(
                        {
                            url: `/api/event/${eventId}`,
                            headers: {
                                "content-type": content_type,
                            },
                            method: "GET",
                        },
                        {
                            status: 200,
                            expectRequest: {
                                keys: eventKeys,
                                object: "@newEvent",
                            },
                        }
                    )
                })

            cy.get<EventInterface>("@newEvent").then((event: EventInterface) => {
                cy.url().should("include", event._id)
                cy.checkEventComponentProps(event)
            })
            cy.clickButton("viper", "viper", `/`)

            cy.wait(500)
            cy.clickButton("nav-item", "Events", `/events`)
            cy.url().should("include", `/events`)
            cy.clickButton("tab-item", "Music", `/events/Music`)
            cy.url().should("include", `/events/Music`)
            cy.getByData("display-events").should("exist").eq(0)
            cy.getByData("select-event").click()
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
                            alias: "selectedEventId",
                        })
                })
            cy.get<ID>("@selectedEventId").then((event: ID) => {
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
                            alias: "selectedEvent",
                        },
                    }
                )
            })

            cy.get<EventInterface>("@selectedEvent").then((event: EventInterface) => {
                cy.checkEventComponentProps(event)
                cy.clickButton("participate", "Participate", `/${event._id}/customer`)
                cy.url().should("contain", `/${event._id}/customer`)
            })

            cy.inputType("password", password)
            cy.inputType("customer-phone", requestCustomerAddress.phone)
            cy.inputType("customer-address", requestCustomerAddress.address)
            cy.inputType("customer-city", requestCustomerAddress.city)
            cy.inputType("customer-province", requestCustomerAddress.province)
            cy.inputType("customer-zip-code", requestCustomerAddress.zip)
            cy.inputSelect("customer-country", requestCustomerAddress.country)
            cy.intercept("POST", `/api/customer/create-shopify`).as("customer-shopify")
            cy.intercept("POST", `/api/customer/create-access-token`).as("access-token")
            cy.intercept("POST", `/api/customer/create-address`).as("create-address")
            cy.intercept("PUT", `/api/customer/update-viper`).as("update-viper")
            cy.clickButton("create-customer", "Create Customer")

            cy.wait("@customer-shopify").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/create-shopify`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: {
                            email: userEmail,
                            password: password,
                            phone: requestCustomerAddress.phone,
                            firstName: firstName,
                            lastName: lastName,
                        },
                        reqKeys: ["email", "password", "phone", "firstName", "lastName"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseNewCustomerKeys,
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: {
                            reqKey: "customer.id",
                            objKey: "customerId",
                        },
                        object: responseCustomerShopify,
                        objPath: "shopify",
                        alias: "responseCustomerShopify",
                    }
                )
            })
            cy.wait("@access-token").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/create-access-token`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: {
                            email: userEmail,
                            password: password,
                        },
                        reqKeys: ["email", "password"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: ["accessTokenUserErrors", "customerAccessToken"],
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: {
                            reqKey: "customerAccessToken.accessToken",
                            objKey: "customerAccessToken",
                        },
                        object: "@responseCustomerShopify",
                        objPath: "shopify",
                    }
                )
            })

            cy.wait("@create-address").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/create-address`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: [
                            { firstName: firstName, lastName: lastName },
                            { address: requestCustomerAddress },
                            "@responseCustomerShopify",
                        ],
                        reqKeys: [
                            "firstName",
                            "lastName",
                            "address",
                            ...responseCustomerShopifyKeys,
                        ],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseCustomerAddressKeys,
                    },
                    {
                        source: "shopify",
                    }
                )
            })

            cy.wait("@update-viper").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/update-viper`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "PUT",
                        reqBody: [
                            "@viperId",
                            "@responseCustomerShopify",
                            { address: requestCustomerAddress },
                        ],
                        reqKeys: [..._idKey, ...responseCustomerShopifyKeys, "address"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: viperKeys,
                        resBody: "@profile",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },

                    {
                        body: "request",
                        propKeys: [
                            {
                                reqKey: "shopify",
                                objKey: "shopify",
                            },
                            {
                                reqKey: "address",
                                objKey: "address",
                            },
                        ],
                        object: "@profile",
                    }
                )
            })

            cy.get<Session>("@session").then((session: Session) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${session._id}`,
                        headers: {
                            "content-type": content_type,
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: viperKeys,
                            object: "@profile",
                        },
                    }
                )
            })
            cy.wait(1000)
            cy.apiRequestAndResponse(
                {
                    url: "/api/auth/session",
                    method: "GET",
                    headers: {
                        "content-type": content_type,
                    },
                },
                {
                    status: 200,
                    expectRequest: {
                        keys: sessionKeys,
                        object: "@responseCustomerShopify",
                        path: "user",
                    },
                    build: {
                        object: "@session",
                    },
                }
            )
            cy.get<EventInterface>("@selectedEvent").then((selectedEvent: EventInterface) => {
                cy.url().should("contain", `${selectedEvent._id}`)
                cy.buildObjectProperties(
                    selectedEvent,
                    { product: rawProduct },
                    {
                        propKeys: {
                            reqKey: "product",
                            objKey: "product",
                        },
                        alias: "selectedProduct",
                    }
                )
            })

            cy.intercept("POST", `/api/shopify/create-checkout`).as("create-checkout")
            cy.intercept("POST", `/api/customer/associate-checkout`).as("associate-checkout")
            cy.intercept("PUT", `/api/event/request-participation`).as("request-participation")
            cy.clickButton("participate", "Participate")

            cy.wait("@create-checkout").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/shopify/create-checkout`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: ["@selectedProduct", { email: userEmail }],
                        reqKeys: ["product", "email"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseCheckoutCreateKeys,
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: {
                            reqKey: "checkout.id",
                            objKey: "checkoutId",
                        },
                        object: responseCheckoutId,
                        alias: "responseCheckoutId",
                    }
                )
            })

            cy.wait("@associate-checkout").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/associate-checkout`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: ["@responseCheckoutId", "@responseCustomerShopify"],
                        reqKeys: ["checkoutId", ...responseCustomerShopifyKeys],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseCheckoutCustomerAssociateKeys,
                        // Here we can expect a body, customer _id
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: {
                            reqKey: "associateCheckout.webUrl",
                            objKey: "webUrl",
                        },
                        object: responseCheckoutWebUrl,
                        alias: "responseCheckoutWebUrl",
                    }
                )
            })

            cy.wait("@request-participation").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/event/request-participation`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "PUT",
                        reqBody: [
                            {
                                viper: "@viperId",
                            },

                            {
                                event: "@selectedEventId",
                            },
                            "@responseCheckoutId",
                        ],
                        reqKeys: ["viper", "event", "checkoutId"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: viperKeys,
                        resBody: "@profile",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                    {
                        body: "request",
                        propKeys: [
                            {
                                reqKey: "event._id",
                                objKey: "_id",
                            },
                            {
                                reqKey: "checkoutId",
                                objKey: "checkoutId",
                            },
                        ],
                        object: "@profile",
                        objPath: "myEvents.collection",
                    }
                )
            })
            cy.get<ID>("@responseCheckoutWebUrl").then((checkout: ID) => {
                cy.get<CustomerShopify>("@responseCustomerShopify").then(
                    (response: CustomerShopify) => {
                        cy.get<Product>("@selectedProduct").then((product: Product) => {
                            cy.clickButton("participate", "VIPER GO", checkout.webUrl)
                            cy.request({
                                method: "POST",
                                url: "https://api.shopify.com/checkout",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-Shopify-Access-Token": response.shopify.customerAccessToken,
                                },
                                body: {
                                    line_items: [
                                        {
                                            variant_id: { product: product.variant_id },
                                            quantity: 1,
                                        },
                                    ],
                                    shipping_address: {
                                        first_name: firstName,
                                        last_name: lastName,
                                        address1: "Los Algarrobos",
                                        city: "Los Hornillos",
                                        province: "Córdoba",
                                        country: "Argentina",
                                        zip: "5100",
                                    },
                                    payment_details: {
                                        credit_card: {
                                            number: "1",
                                            name: "Bogus Gateway",
                                            month: "11",
                                            year: "2023",
                                            verification_value: "123",
                                        },
                                    },
                                },
                            }).then((response) => {})
                            cy.visit(checkout.webUrl)
                            cy.pause()
                        })
                    }
                )
            })
        })
    })
})
