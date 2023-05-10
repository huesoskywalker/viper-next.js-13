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
import { rawViper, myBlog, rawViperId, ID, rawViperBasicProps, blog } from "../support/myApp/viper"
import {
    responseCheckoutId,
    responseCheckoutWebUrl,
    responseCommentEvent,
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
    requestEventImage,
    requestProductMedia,
    requestCustomerAddress,
    requestProductShopify,
    requestCommentEvent,
    requestChatContact,
} from "../support/request/requestObjects"
import {
    requestEditProfileKeys,
    requestCreateEventKeys,
    requestEventImageKeys,
    requestProductMediaKeys,
    requestCommentKeys,
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
    responseCommentEventKeys,
} from "../support/response/responseKeys"
import { viperBasicKeys, _idKey, myBlogKeys, viperKeys } from "../support/myApp/viperKeys"
import { eventKeys } from "../support/myApp/eventKeys"
import { sessionKeys } from "../support/myApp/sessionKeys"
import { CustomerShopify } from "../support/response/responseTypes"
import { Session } from "../support/myApp/session"
import { Chats, MyBlog, Viper, ViperBasicProps } from "@/types/viper"
import { Comments, EventInterface, Product } from "@/types/event"
import { Interception } from "cypress/types/net-stubbing"
import { format, formatDistanceToNow } from "date-fns"
import { Alias } from "../support/commands"
import { rawChatKeys } from "../support/myApp/chatsKeys"
import { rawChat } from "../support/myApp/chats"

export {}

describe("Profile Page", () => {
    beforeEach(() => {
        cy.signInWithCredential(username, password)
        cy.visit("/")
    })
    context("Interacts with the viper App", () => {
        it("Creates a blog", () => {
            cy.log(`Profile`)

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
                cy.navigate("nav-item", session.name, `/profile`)
                cy.checkProfileComponent("@profile" as Alias<string>, "Edit Profile")
                // cy.clickButton("nav-item", session.name)
                // cy.url().should("include", "/profile")
                cy.navigate("edit-profile", "Edit Profile", `/profile/edit/${session._id}`)
                // cy.clickButton("edit-profile", "Edit Profile")
                // cy.url().should("include", `/profile/edit/${session._id}`)
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
                // =============== Profile make a silly command and use it twice
                // mce the add follow for edit
                cy.checkProfileComponent(viper as Viper, "Edit Profile")
                // cy.getByData("profile-image")
                //     .should("have.attr", "src", `/vipers/${viper.image}`)
                //     .and("be.visible")
                // cy.getByData("background-image")
                //     .should("have.attr", "src", `/vipers/${viper.backgroundImage}`)
                //     .and("be.visible")
                // cy.dataInContainer("viper-name", viper.name)
                // cy.dataInContainer("viper-location", viper.location)
                // cy.dataInContainer("viper-biography", viper.biography)
                // cy.getByData("display-show-follow").eq(0).should("exist").and("be.visible")
                // cy.getByData("display-show-follow").eq(1).should("exist").and("be.visible")
                // // this one check if profile or viper Following or follow
                // cy.dataInContainer("edit-profile", "Edit Profile")
            })

            // ======================BLOG=====================TEST CAN BE PERFORM BETTER IN HERE============================

            cy.clickButton("blog-button", "Let's Blog")
            cy.getByData("commentInput").should("exist")
            cy.inputType("add-comment", requestCreateBlog.comment)
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
                        reqKeys: [..._idKey, ...requestCommentKeys],
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
                cy.get<MyBlog>("@myBlog").then((blog) => {
                    cy.checkCommentCardComponent(
                        session as Session,
                        blog as MyBlog,
                        requestCreateBlog.comment
                    )
                    // cy.getByData("blog-viper-image")
                    //     .should("have.attr", "src", `/vipers/${session.image}`)
                    //     .and("be.visible")
                    // cy.dataInContainer("blog-viper-name", session.name)
                    // cy.dataInContainer("comment-timestamp", format(blog.timestamp, "MMM d, yyyy"))
                    // cy.getByData("blog-comment").eq(0).should("contain", requestCreateBlog.content)
                })
            })
            cy.log("Success creating a Blog")
            cy.get<MyBlog>("@myBlog").then((blog: MyBlog) => {
                cy.likeCommentCard(blog as MyBlog, ["@profile", "@profile"])
                // we might be able to recheck the component since the results were updated,... and ,add the followers count
            })
            // cy.intercept("POST", `/api/viper/blog/like`).as("like-blog")
            // cy.getByData("like-blog").eq(0).click()

            // cy.url().then((url) => {
            //     cy.get<MyBlog>("@myBlog").then((blog: MyBlog) => {
            //         cy.get<Session>("@session").then((session: Session) => {
            //             const regex = /\/[a-f\d]{24}$/
            //             if (regex.test(url)) {
            //                 const id = url.split("/").pop()
            //                 cy.wrap<LikeBlog>(requestLikeBlog)
            //                     .then((likeRequest: LikeBlog) => {
            //                         likeRequest._id = blog._id
            //                         likeRequest.blogOwner_id = id
            //                         likeRequest.viper_id = session._id
            //                         return likeRequest
            //                     })
            //                     .as("requestLikeBlog")
            //             } else {
            //                 cy.wrap<LikeBlog>(requestLikeBlog)
            //                     .then((likeRequest: LikeBlog) => {
            //                         likeRequest._id = blog._id
            //                         likeRequest.blogOwner_id = session._id
            //                         likeRequest.viper_id = session._id
            //                         return likeRequest
            //                     })
            //                     .as("requestLikeBlog")
            //             }
            //         })
            //     })
            // })
            // cy.wait("@like-blog").then((interception: Interception) => {
            //     cy.verifyInterceptionRequestAndResponse(
            //         interception,
            //         {
            //             reqUrl: `/api/viper/blog/like`,
            //             reqHeaders: {
            //                 "content-type": content_type,
            //             },
            //             reqMethod: "POST",
            //             reqBody: "@requestLikeBlog",
            //             reqKeys: [...requestLikeBlogKeys, "timestamp"],
            //         },
            //         {
            //             resStatus: 200,
            //             resHeaders: {
            //                 "content-type": content_type,
            //             },
            //             resKeys: [viperKeys, viperKeys],
            //             resBody: ["@profile", "@profile"],
            //         },
            //         [
            //             {
            //                 source: "mongodb",
            //                 action: "edit",
            //             },
            //             {
            //                 source: "mongodb",
            //                 action: "edit",
            //             },
            //         ],
            //         [
            //             {
            //                 body: "request",
            //                 propKeys: {
            //                     reqKey: "viper_id",
            //                     objKey: "_id",
            //                 },
            //                 object: "@profile",
            //                 objPath: `blog.myBlog[0].likes[0]`,
            //             },
            //             null,
            //         ]
            //     )
            // })

            // cy.get<Session>("@session").then((session: Session) => {
            //     cy.apiRequestAndResponse(
            //         {
            //             url: `/api/viper/${session._id}`,
            //             headers: {
            //                 "content-type": content_type,
            //             },
            //             method: "GET",
            //         },
            //         {
            //             status: 200,
            //             expectRequest: {
            //                 keys: externalBlogKeys,
            //                 object: "@requestLikeBlog",
            //                 path: "blog.likes[0]",
            //             },
            //             build: {
            //                 object: "@profile",
            //             },
            //         }
            //     )
            // })

            cy.getByData("like-blog")
                .eq(0)
                .invoke("css", "color")
                .should("equal", "rgb(185, 28, 28)")
            cy.getCookies().then((cookies) => {
                expect(cookies[2]).to.have.property("value", "red")
            })

            cy.log("Successful Profile ")

            cy.log(`Dashboard`)

            cy.navigate("nav-item", "Dashboard", `/dashboard`)
            // cy.clickButton("nav-item", "Dashboard", "/dashboard")
            // cy.url().should("include", "/dashboard")
            cy.navigate("dast-myevents", "My Events", `/dashboard/myevents`)
            // cy.clickButton("dash-myevents", "My Events", "/dashboard/myevents")
            // cy.url().should("include", "/dashboard/myevents")
            cy.navigate("tab-create", "Create Event", `/dashboard/myevents/create`)
            // cy.clickButton("dash-create", "Create Event", "/dashboard/myevents/create")
            // cy.url().should("include", "/dashboard/myevents/create")

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
            cy.navigate("tab-myevents", "My Events", `/dashboard/myevents`)
            // cy.clickButton("dash-myevents", "My Events", "/dashboard/myevents")
            // cy.url().should("include", "/dashboard/myevents")
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
                cy.navigate("edit", "Edit", `/dashboard/myevents/${event._id}`)
                // cy.clickButton("edit", "Edit", `/dashboard/myevents/${event._id}`).eq(0)
                // cy.url().should("include", `/dashboard/myevents/${event._id}`)
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
            cy.navigate("viper", "viper", "/")
            // cy.clickButton("viper", "viper", `/`)

            cy.wait(500)
            cy.navigate("nav-item", "Events", `/events`)
            // cy.clickButton("nav-item", "Events", `/events`)
            // cy.url().should("include", `/events`)
            cy.navigate("tab-Music", "Music", `/events/Music`)
            // cy.clickButton("tab-Music", "Music", `/events/Music`)
            // cy.url().should("include", `/events/Music`)
            cy.getByData("display-events").should("exist").eq(0)
            cy.getByData("select-event").click()

            cy.buildEventFromUrlAndCheckComponent("selectedEvent")

            // cy.url()
            //     .should((url) => {
            //         expect(url).to.match(/\/[a-f\d]{24}$/)
            //     })
            //     .then((url) => {
            //         const id = {
            //             _id: url.split("/").pop(),
            //         }
            //         if (id)
            //             cy.buildObjectProperties(id, rawEventId, {
            //                 propKeys: {
            //                     reqKey: "_id",
            //                     objKey: "_id",
            //                 },
            //                 alias: "selectedEventId",
            //             })
            //     })
            // cy.get<ID>("@selectedEventId").then((event: ID) => {
            //     cy.apiRequestAndResponse(
            //         {
            //             url: `/api/event/${event._id}`,
            //             headers: {
            //                 "content-type": content_type,
            //             },
            //             method: "GET",
            //         },
            //         {
            //             status: 200,
            //             expectRequest: {
            //                 keys: eventKeys,
            //                 object: { _id: event._id },
            //             },
            //             build: {
            //                 object: rawEvent,
            //                 alias: "selectedEvent",
            //             },
            //         }
            //     )
            // })

            // cy.get<EventInterface>("@selectedEvent").then((event: EventInterface) => {
            //     cy.checkEventComponentProps(event)
            // })

            cy.get<ID>("selectedEventId").then((event) => {
                // cy.clickButton("participate-customer", "Participate", `/${event._id}/customer`)
                // cy.url().should("contain", `/${event._id}/customer`)
                cy.navigate("participate-customer", "Participate", `/${event._id}/customer`)
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
            cy.clickButton("participate-checkout", "Participate")

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
                            cy.clickButton("participate-payment", "VIPER GO", checkout.webUrl)
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

        it.only("Second round pa", () => {
            // // ===================================================================
            // // This build property should be removed if we manage to pause and continue, i guess if we want to
            // // take track of a lot of green lines
            // const _id: string = "6453cd3cd1ad94317450eabe"
            // cy.buildObjectProperties({ _id: _id }, rawEventId, {
            //     propKeys: {
            //         reqKey: "_id",
            //         objKey: "_id",
            //     },
            //     // I we built the same alias so we could delete
            //     alias: "selectedEventId",
            // })
            // cy.apiRequestAndResponse(
            //     {
            //         url: `/api/event/${_id}`,
            //         method: "GET",
            //         headers: {
            //             "content-type": content_type,
            //         },
            //     },
            //     {
            //         status: 200,
            //         build: {
            //             object: rawEvent,
            //             alias: "selectedEvent",
            //         },
            //     }
            // )
            // // delete this as well on the full run
            // cy.get<Session>("@session").then((session: Session) => {
            //     cy.buildObjectProperties(session, rawViperId, {
            //         propKeys: {
            //             reqKey: "_id",
            //             objKey: "_id",
            //         },
            //         alias: "viperId",
            //     })
            //     cy.apiRequestAndResponse(
            //         {
            //             url: `/api/viper/${session._id}`,
            //             method: "GET",
            //             headers: {
            //                 "content-type": content_type,
            //             },
            //         },
            //         {
            //             status: 200,
            //             build: {
            //                 object: rawViper,
            //                 alias: "profile",
            //             },
            //         }
            //     )
            // })
            // // ========================================================
            cy.log(`hello`)
            cy.get<EventInterface>("@selectedEvent").then((event: EventInterface) => {
                cy.visit(`/${event._id}`)
                cy.url().should("contain", `/${event._id}`)

                cy.checkEventComponentProps(event)

                cy.intercept(`/api/event/claim-card`).as("claim-card")
                cy.clickButton("participate-claim", "CLAIM CARD")

                cy.wait("@claim-card").then((interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/event/claim-card`,
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqMethod: "POST",
                            reqBody: [{ event: "@selectedEventId" }, { viper: "@viperId" }],
                            reqKeys: ["event", "viper"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: eventKeys,
                            resBody: event,
                        },
                        {
                            source: "mongodb",
                            action: "edit",
                        },
                        {
                            body: "request",
                            propKeys: {
                                reqKey: "viper._id",
                                objKey: "_id",
                            },
                            object: event,
                            objPath: "participants",
                        }
                    )
                })
            })
            cy.dataInContainer("viper", "ViPER")
            // =====================READ==========================

            cy.navigate("nav-item", "Dashboard", `/dashboard`)
            cy.navigate("tab-myevents", "My Events", `/dashboard/myevents`)
            cy.navigate("tab-collection", "Collection", `/dashboard/myevents/collection`)
            cy.checkCollectionEventCard("@selectedEvent")
            // ===========================In here we start with a new event,
            // Let's grab a new event, wrap it as likedEvent
            cy.navigate("nav-item", "Events", `/events`)
            cy.navigate("tab-Bars", "Bars", `/events/Bars`)
            cy.getByData("display-events").should("exist").eq(0)
            cy.getByData("select-event").click()
            // ===================================== TILL HERE WE ARE COOL YO
            cy.buildEventFromUrlAndCheckComponent("likedEvent")
            // ---------
            cy.likeEventAndVerifyEndpoints(["@likedEvent", "@profile"])
            // =================================================
            cy.getByData("comment-event").click()
            cy.getByData("comment-input").should("exist").and("be.visible")
            cy.getByData("close-input").should("exist").and("be.visible")
            cy.getByData("viper-image").should("exist").and("be.visible")
            cy.inputType("write-comment", requestCommentEvent.comment)
            cy.intercept(`/api/event/comment/post`).as("comment-event")
            cy.clickButton("post-comment", "Comment")
            cy.wait("@comment-event").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/event/comment`,
                        reqMethod: "POST",
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqBody: [
                            {
                                event: "@likedEventId",
                            },
                            {
                                viper: "@viperId",
                            },

                            requestCommentEvent,
                        ],
                        reqKeys: ["event", "viper", ...requestCommentKeys],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: eventKeys,
                        resBody: "@likedEvent",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    }
                )
            })
            cy.get<ID>("@likedEventId").then((event: ID) => {
                cy.get<ID>("@viperId").then((viper: ID) => {
                    cy.apiRequestAndResponse(
                        {
                            url: `/api/event/comment/${event._id}`,
                            method: "GET",
                            headers: {
                                "content-type": content_type,
                            },
                        },
                        {
                            status: 200,
                            expectRequest: {
                                keys: responseCommentEventKeys,
                                object: {
                                    viperId: viper._id,
                                    text: requestCommentEvent.comment,
                                },
                                path: "comment",
                            },
                            build: {
                                object: responseCommentEvent,
                                alias: "responseCommentEvent",
                            },
                        }
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
                            keys: responseCommentEventKeys,
                            object: "@responseCommentEvent",
                            path: "comments[0]",
                        },
                        build: {
                            object: "@likedEvent",
                        },
                    }
                )
            })
            cy.getByData("comment-input").should("not.exist")
            cy.getByData("event-comment-card").should("exist").and("be.visible")
            // ===================================Above is comment event
            cy.get<Session>("@session").then((session: Session) => {
                // ==============READ MAKE A COMPONENT FOR THIS ONE AS WELL
                cy.dataInImage("viper-image", session.image)
                cy.dataInContainer("blogger-name", session.name)
                cy.get<Comments>("@responseCommentEvent").then((comment) => {
                    cy.dataInContainer(
                        "comment-timestamp",
                        format(comment.timestamp, "MMM d, yyyy")
                    )
                    cy.get<EventInterface>("@likedEvent").then((event) => {
                        cy.dataInContainer("comment-on", `${event.title}`)
                    })
                    cy.intercept(`/api/event/comment/like`).as("like-comment")
                    cy.getByData("like-comment").click()
                    cy.wait("@like-comment").then((interception) => {
                        cy.verifyInterceptionRequestAndResponse(
                            interception,
                            {
                                reqUrl: `/api/event/comment/like`,
                                reqHeaders: {
                                    "content-type": content_type,
                                },
                                reqMethod: "POST",
                                reqBody: [
                                    {
                                        viper: { _id: session._id },
                                    },
                                    {
                                        event: "@likedEventId",
                                    },
                                    {
                                        comment: { _id: comment._id },
                                    },
                                ],
                                reqKeys: ["viper", "event", "comment"],
                            },
                            {
                                resStatus: 200,
                                resHeaders: {
                                    "content-type": content_type,
                                },
                                resKeys: eventKeys,
                            },
                            {
                                source: "mongodb",
                                action: "edit",
                            },
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "viper._id",
                                    objKey: "_id",
                                },
                                object: "@likedEvent",
                                objPath: "comments[0].likes[0]",
                            }
                        )
                    })
                })
            })

            // =============READ READ READ===========
            cy.get<EventInterface>("@likedEvent").then((event: EventInterface) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${event.organizer._id}?props=basic-props`,
                        method: "GET",
                        headers: {
                            "content-type": content_type,
                        },
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: viperBasicKeys,
                            object: { _id: event.organizer._id },
                        },
                        build: {
                            object: rawViperBasicProps,
                            alias: "likedEventOrganizer",
                        },
                    }
                )
            })
            // TILL HERE WE ARE COOL YO
            // ===========READ MAKE A COMPONENT FOR THIS ONE
            cy.getByData("hover-organizer").trigger("mouseover")
            cy.getByData("display-viper").should("exist").and("be.visible")
            cy.get<ViperBasicProps>("@likedEventOrganizer").then((organizer: ViperBasicProps) => {
                cy.dataInImage("display-organizer-image", organizer.image)
                cy.getByData("display-add-follow")
                    .should("exist")
                    .should("be.visible")
                    .and("contain", "Follow")
                cy.getByData("display-organizer-name")
                    .should("have.attr", "href", `/dashboard/vipers/${organizer._id}`)
                    .should("contain", organizer.name)
                cy.dataInContainer("display-organizer-location", organizer.location)
                cy.dataInContainer("display-organizer-biography", organizer.biography)
                cy.getByData("display-show-follow").eq(0).should("exist").and("be.visible")
                cy.getByData("display-show-follow").eq(1).should("exist").and("be.visible")

                // -follow
                cy.intercept(`/api/viper/follow`).as("follow-viper")
                cy.clickButton("display-add-follow", "Follow")
                cy.wait("@follow-viper").then((interception) => {
                    console.log(`-------are we intercepting bro?-- follow-viper`)
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/viper/follow`,
                            reqMethod: "PUT",
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqBody: [
                                {
                                    currentViper: "@viperId",
                                },
                                {
                                    viper: { _id: organizer._id },
                                },
                            ],
                            reqKeys: ["currentViper", "viper"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: [viperKeys, viperKeys],
                            resBody: [organizer, "@profile"],
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
                                    reqKey: "currentViper._id",
                                    objKey: "_id",
                                },
                                object: organizer,
                                objPath: "followers[0]",
                            },
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "viper._id",
                                    objKey: "_id",
                                },
                                object: "@profile",
                                objPath: "follows[0]",
                            },
                        ]
                    )
                })

                cy.wait(300)
                cy.navigate(
                    "display-organizer-name",
                    organizer.name,
                    `/dashboard/vipers/${organizer._id}`
                )
                // ===============PROFILE
                cy.checkProfileComponent(organizer as ViperBasicProps, "Following")

                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${organizer._id}`,
                        method: "GET",
                        headers: {
                            "content-type": content_type,
                        },
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: viperKeys,
                            object: organizer,
                        },
                        build: {
                            object: organizer,
                            alias: "organizerProfile",
                        },
                    }
                )
            })
            cy.get<Viper>("@organizerProfile").then((organizer) => {
                cy.checkCommentCardComponent(organizer, organizer.blog.myBlog[0])
                cy.likeCommentCard(organizer.blog.myBlog[0], [organizer, "@profile"])

                cy.navigate("nav-item", "Dashboard", `/dashboard`)
                cy.navigate("tab-myevents", "My Events", `/dashboard/myevents`)
                cy.navigate("tab-likes", "Likes", `/dashboard/myevents/likes`)
                cy.checkCollectionEventCard("@likedEvent")

                cy.navigate("tab-messages", "Messages", `/dashboard/messages`)
                cy.dataInImage("contact-image", organizer.image)
                cy.dataInContainer("contact-name", organizer.name)
                cy.navigate("contact-name", organizer.name, `/dashboard/messages/${organizer._id}`)

                // =========================Chats
                cy.inputType("message", requestChatContact.message)
                cy.intercept(`/api/messages/chat`).as("messenger")
                cy.getByData("send-message").click()
                cy.get<Session>("@session").then((session: Session) => {
                    cy.wait("@messenger").then((interception) => {
                        cy.verifyInterceptionRequestAndResponse(
                            interception,
                            {
                                reqUrl: `/api/messages/chat`,
                                reqMethod: "POST",
                                reqHeaders: {
                                    "content-type": content_type,
                                },
                                reqBody: [
                                    {
                                        contact: {
                                            _id: organizer._id,
                                        },
                                    },
                                    {
                                        viper: {
                                            _id: session._id,
                                        },
                                    },
                                    {
                                        message: requestChatContact.message,
                                    },
                                ],
                                reqKeys: ["contact", "viper", "message", "timestamp"],
                            },
                            {
                                resStatus: 200,
                                resHeaders: {
                                    "content-type": content_type,
                                },
                                resKeys: ["_id", "members", "messages"],
                                resBody: {
                                    members: [session._id, organizer._id],
                                },
                            },
                            {
                                source: "mongodb",
                                action: "edit",
                            }
                        )
                    })
                    cy.apiRequestAndResponse(
                        {
                            url: `/api/messages/${organizer._id}`,
                            method: "POST",
                            headers: {
                                "content-type": content_type,
                            },
                            body: { viper: { _id: session._id } },
                        },
                        {
                            status: 200,
                            // change name for expect Response
                            expectRequest: {
                                keys: rawChatKeys,
                                object: { members: [session._id, organizer._id] },
                            },
                            build: {
                                object: rawChat,
                                alias: "newChat",
                            },
                        }
                    )

                    cy.get<Chats>("@newChat").then((chat: Chats) => {
                        cy.dataInContainer("viper-name", session.name)
                        cy.dataInContainer("viper-message", requestChatContact.message)
                        cy.dataInContainer(
                            "chat-timestamp",
                            `${formatDistanceToNow(new Date(chat.messages[0].timestamp))} ago`
                        )
                    })
                })
                cy.navigate("viper", "viper", `/`)
                cy.log(`Hope you enjoyed the ride`)
            })
        })
    })
})
