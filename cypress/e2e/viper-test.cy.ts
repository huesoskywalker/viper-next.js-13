/* global window */
/// <reference path="../types.d.ts" />

import {
    checkoutEntries,
    customerEntries,
    username,
    password,
    createProductMedia,
} from "../support/entryPoint"
import { event } from "../support/event"
import { imageFile, productShopify } from "../support/entryPoint"
import { viper, myBlog } from "../support/viper"
import {
    eventKeys,
    newEventKeys,
    productKeys,
    stageUploadKeys,
    viperKeys,
    myBlogKeys,
    externalBlogKeys,
} from "../support/objectKeys"
import {
    responseNewEvent,
    responseProductId,
    responseProductMedia,
    responsePublishProduct,
} from "../support/responseObjects"
import {
    typeDate,
    typeTime,
    createEventRequest,
    profileEditRequest,
    editEventRequest,
    blogRequest,
    likeBlogRequest,
} from "../support/requestObjects"

export {}

// =================================================================
// Apply middleware on the API interceptions, once middleware from next-auth is implemented
// { middleware: true },
describe("Profile Page", () => {
    beforeEach(() => {
        cy.signInWithCredential(username, password)
        cy.visit("/")
    })
    context("Interacts in  the Profile Page", () => {
        it.only("Creates a blog", () => {
            cy.log(`Profile`)
            cy.get("@session").then((session: any) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${session._id}`,
                        headers: {
                            "content-type": "application/json",
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
                            object: viper,
                            alias: "profile",
                        },
                    }
                )
            })

            cy.get("@profile").then((viper: any) => {
                cy.clickButton("nav-item", viper.name)
                cy.url().should("include", "/profile")
                cy.clickButton("edit-profile", "Edit Profile")
                cy.url().should("include", `/profile/edit/${viper._id}`)
            })
            cy.wrap(profileEditRequest)
                .then((editRequest) => {
                    cy.inputType("new-name", editRequest.name)
                    cy.inputType("new-biography", editRequest.biography)
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

                    cy.inputSelect("new-location", profileEditRequest.location)
                    cy.intercept("PUT", `/api/viper/edit`).as("edit-viper")
                })
                .as("profileEditRequest")
            cy.clickButton("submit-button", "Edit")
            // ===============READ==========================
            // This double wait is because with cypress the files get uploaded twice.
            // drove me crazy 3 days.
            cy.wait("@profile-image")
            cy.wait("@profile-image").then((interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                expect(statusCode).eq(200)
                expect(responseBody.data.url).to.be.a("string")

                cy.log(interception.request.body)
                cy.wrap(profileEditRequest)
                    .then((editRequest) => {
                        editRequest.image = responseBody.data.url
                    })
                    .as("profileEditRequest")
            })
            cy.wait("@background-image").then((interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                const bgData = responseBody.bgData
                expect(statusCode).eq(200)
                expect(responseBody.bgData.url).to.be.a("string")
                cy.wrap(profileEditRequest)
                    .then((editRequest) => {
                        editRequest.backgroundImage = bgData.url
                    })
                    .as("profileEditRequest")
            })
            cy.wait("@edit-viper").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/viper/edit`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "PUT",
                        reqBody: "@profileEditRequest",
                    },
                    {
                        resStatus: 200,
                        resBody: "@profile",
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    }
                )
                cy.get("@session").then((session: any) => {
                    cy.apiRequestAndResponse(
                        {
                            url: `/api/viper/${session._id}`,
                            headers: {
                                "content-type": "application/json",
                            },
                            method: "GET",
                        },
                        {
                            status: 200,
                            expectRequest: {
                                keys: viperKeys,
                                object: "@profileEditRequest",
                            },
                            build: {
                                object: "@profile",
                            },
                        }
                    )
                })
            })
            cy.url().should("include", "/profile")
            cy.get("@profile").then((viper: any) => {
                cy.getByData("profileImage").should("be.visible")
                cy.getByData("backgroundImage").should("be.visible")
                cy.dataInContainer("name", viper.name)
                cy.dataInContainer("location", viper.location)
                cy.dataInContainer("biography", viper.biography)
                cy.wrap(blogRequest)
                    .then((blogRequest) => {
                        blogRequest._id = viper._id
                    })
                    .as("blogRequest")
            })

            // ======================BLOG=====================TEST CAN BE PERFORM BETTER IN HERE============================

            cy.clickButton("blog-button", "Let's Blog")
            cy.getByData("commentInput").should("exist")
            cy.inputType("add-comment", blogRequest.content)
            cy.intercept("POST", `/api/viper/blog/create`).as("create-blog")
            cy.clickButton("post-blog", "Comment")
            cy.wait("@create-blog").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/viper/blog/create`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "POST",
                        reqBody: "@blogRequest",
                    },
                    {
                        resStatus: 200,
                        resBody: "@profile",
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    }
                )
            })

            cy.getByData("commentInput").should("not.exist")
            cy.get("@profile").then((viper: any) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/blog/all`,
                        headers: {
                            "content-type": "application/json",
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
                            object: {
                                content: blogRequest.content,
                            },
                        },
                        build: {
                            object: myBlog,
                            alias: "myBlog",
                        },
                    }
                )
            })

            // .its("body")
            // .each((value) => {
            //     return expect(value).to.have.all.keys(myBlogKeys)
            // })
            cy.get("@session").then((session: any) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${session._id}`,
                        headers: {
                            "content-type": "application/json",
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: myBlogKeys,
                            object: "@myBlog",
                            // [-1] is not working to grab the last index of the array
                            path: "blog.myBlog[0]",
                        },
                        build: {
                            object: "@profile",
                        },
                    }
                )
                cy.dataInContainer("blog-viperName", session.name)
            })
            cy.getByData("success-blog").eq(0).should("contain", blogRequest.content)
            cy.log("Success creating a Blog")
            cy.intercept("POST", `/api/viper/blog/like`).as("like-blog")
            cy.getByData("like-blog").eq(0).click()
            cy.get("@myBlog").then((blog: any) => {
                cy.get("@session").then((session: any) => {
                    cy.url().then((url) => {
                        const regex = /\/[a-f\d]{24}$/
                        if (regex.test(url)) {
                            const id = url.split("/").pop()

                            cy.wrap(likeBlogRequest)
                                .then((likeRequest: any) => {
                                    likeRequest._id = blog._id
                                    likeRequest.blogOwner_id = id
                                    likeRequest.viper_id = session._id
                                    return likeRequest
                                })
                                .as("likeBlogRequest")
                        } else {
                            cy.wrap(likeBlogRequest)
                                .then((likeRequest: any) => {
                                    likeRequest._id = blog._id
                                    likeRequest.blogOwner_id = session._id
                                    likeRequest.viper_id = session._id
                                    return likeRequest
                                })
                                .as("likeBlogRequest")
                        }
                    })
                })
            })
            // // We are stuck here

            cy.wait("@like-blog").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/viper/blog/like`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "POST",
                        reqBody: "@likeBlogRequest",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@profile",
                        resKeys: viperKeys,
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                    {
                        propKeys: {
                            reqKey: "viper_id",
                            objKey: "_id",
                        },

                        propPath: `blog.myBlog[0].likes[0]`,
                    }
                )
            })

            // // Check here once finish , if it is needed to build the response since I think we might have it already in the code above
            cy.get("@session").then((session: any) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${session._id}`,
                        headers: {
                            "content-type": "application/json",
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: externalBlogKeys,
                            object: "@likeBlogRequest",
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
            // Once the time for a speed run arrives, and start from - , uncomment this!
            cy.getCookies().then((cookies) => {
                expect(cookies[2]).to.have.property("value", "red")
            })

            cy.log("Successful Profile ")
            // })
            // =================================================================================
            // it.only("testing create events", () => {
            cy.log(`Dashboard`)

            cy.clickButton("nav-item", "Dashboard", "/dashboard")
            cy.url().should("include", "/dashboard")
            cy.clickButton("tab-item", "My Events", "/dashboard/myevents")
            cy.url().should("include", "/dashboard/myevents")
            cy.clickButton("tab-item", "Create Event", `${"/dashboard/myevents/create"}`)

            cy.url().should("include", "/dashboard/myevents/create")
            cy.inputType("title", createEventRequest.title)
            cy.inputType("content", createEventRequest.content)
            cy.inputSelect("category", createEventRequest.category)
            cy.inputType("date", typeDate)
            cy.inputType("time", typeTime)
            cy.inputSelect("location", createEventRequest.location)
            cy.inputType("address", createEventRequest.address)
            cy.intercept("POST", "/api/event/create/upload-image").as("event-image")
            cy.getByData("image").selectFile([
                {
                    contents: "cypress/fixtures/images/jam-session.jpeg",
                    fileName: "jam-session.jpeg",
                    mimeType: "image/jpeg",
                    lastModified: new Date("Feb 18 2023").valueOf(),
                },
            ])
            cy.inputType("price", `${createEventRequest.price}`)
            cy.inputType("entries", `${createEventRequest.entries}`)

            cy.intercept("POST", `/api/product/stage-upload`).as("stage-upload")
            cy.intercept("POST", `/api/product/create-shopify`).as("create-shopify")
            cy.intercept("POST", `/api/product/create-media`).as("product-media")
            cy.intercept("POST", `/api/product/publish-shopify`).as("publish-product")
            cy.intercept("POST", `/api/event/create/submit`).as("create-event")
            cy.clickButton("create-event", "Create Event")
            cy.get("@session").then((session: any) => {
                cy.wrap(createEventRequest)
                    .then((eventRequest) => {
                        eventRequest.organizer._id = session._id
                        eventRequest.organizer.name = session.name
                        eventRequest.organizer.email = session.email
                        return eventRequest
                    })
                    .as("createEventRequest")
                cy.wrap(productShopify)
                    .then((product) => {
                        product.organizer = session._id
                        return product
                    })
                    .as("productShopify")
            })
            cy.wait("@event-image").then((interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                expect(statusCode).eq(200)
                expect(responseBody.data).to.exist
                cy.wrap(imageFile)
                    .then((file) => {
                        file.data = responseBody.data
                    })
                    .as("eventImageFile")
                // This will be provisory till we find another method to upload files and retrieve it in the bodyParse: false or switch method
                cy.get("@createEventRequest").then((eventRequest: any) => {
                    eventRequest.image = responseBody.data.url
                    return eventRequest
                })
            })

            cy.wait("@stage-upload").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/stage-upload`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "POST",
                        reqBody: "@eventImageFile",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@productShopify",
                        resKeys: stageUploadKeys,
                    },
                    {
                        source: "shopify",
                    },
                    {
                        propKeys: {
                            reqKey: `stageUpload.resourceUrl`,
                            objKey: `resourceUrl`,
                        },
                        // propPath: null,
                    }
                )
            })
            cy.wrap(responseProductId).as("responseProductId")
            cy.wait("@create-shopify").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/create-shopify`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "POST",
                        reqBody: "@productShopify",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@responseProductId",
                        resKeys: productKeys,
                    },
                    {
                        source: "shopify",
                    },
                    {
                        propKeys: {
                            reqKey: "product.id",
                            objKey: "productId",
                        },
                        // propPath: null,
                    }
                )
            })

            cy.wrap(createProductMedia)
                .then((productMedia) => {
                    cy.get("@responseProductId").then((response: any) => {
                        cy.get("@productShopify").then((product: any) => {
                            productMedia.productId = response.productId
                            productMedia.resourceUrl = product.resourceUrl
                            return productMedia
                        })
                    })
                })
                .as("createProductMedia")

            cy.wrap(responseProductMedia).as("responseProductMedia")
            cy.wait("@product-media").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/create-media`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "POST",
                        reqBody: "@createProductMedia",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@responseProductMedia",
                    },
                    {
                        source: "shopify",
                    }
                )
            })
            cy.wrap(responsePublishProduct).as("responsePublishProduct")
            cy.wait("@publish-product").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/product/publish-shopify`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "POST",
                        reqBody: "@responseProductId",
                    },
                    {
                        resStatus: 200,
                        resBody: "@responsePublishProduct",
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                    },
                    {
                        source: "shopify",
                    }
                )
            })

            cy.wrap(createEventRequest)
                .then((createEventRequest: any) => {
                    cy.get("@session").then((session: any) => {
                        cy.get("@responseProductId").then((response: any) => {
                            createEventRequest.productId = response.productId
                            createEventRequest.organizer._id = session._id
                            createEventRequest.organizer.name = session.name
                            createEventRequest.organizer.email = session.email
                            return createEventRequest
                        })
                    })
                })
                .as("createEventRequest")
            cy.wrap(responseNewEvent).as("responseNewEvent")
            cy.wait("@create-event").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/event/create/submit`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "POST",
                        reqBody: "@createEventRequest",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@responseNewEvent",
                        resKeys: newEventKeys,
                    },
                    {
                        source: "shopify",
                    },
                    {
                        propKeys: {
                            reqKey: "insertedId",
                            objKey: "insertedId",
                        },

                        // propPath: null,
                    }
                )
            })

            // In here can we pass the requestedCreateEvent and expect for the keys?
            cy.get("@responseNewEvent").then((newEvent: any) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/event/${newEvent.insertedId}`,
                        headers: {
                            "content-type": "application/json",
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            keys: eventKeys,
                            object: "@createEventRequest",
                        },
                        build: {
                            object: event,
                            alias: "newEvent",
                        },
                    }
                )
            })
            // This reload crushed my session bro, gtfo

            // cy.reload()
            cy.clickButton("preview-button", "Preview")
            cy.window().scrollTo("bottom")
            cy.get("@newEvent").then((event: any) => {
                cy.checkEventComponentProps(event)
            })

            cy.window().scrollTo("top")

            cy.clickButton("tab-item", "My Events", "/dashboard/myevents")
            cy.url().should("include", "/dashboard/myevents")
            cy.log("Event Card")
            cy.getByData("display-events").should("exist")
            cy.get("@session").then((session: any) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/events/created`,
                        headers: {
                            "content-type": "application/json",
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
            // ===============================================
            cy.getByData("display-events").should("exist").and("be.visible").first()
            cy.getByData("event-card-image").should("exist").and("be.visible").first()

            cy.get("@newEvent").then((event: any) => {
                cy.dataInContainer("event-card-title", event.title).eq(0)
                cy.dataInContainer("event-card-content", event.content).eq(0)
                cy.dataInContainer("event-card-location", event.location).eq(0)
                cy.getByData("event-show-time").should("exist").and("be.visible").eq(0)
                cy.clickButton("edit", "Edit", `/dashboard/myevents/${event._id}`).eq(0)
                cy.url().should("include", `/dashboard/myevents/${event._id}`)
            })

            cy.inputType("event-title", `${editEventRequest.title}`)
            cy.inputType("event-content", `${editEventRequest.content}`)
            cy.inputSelect("event-location", `${editEventRequest.location}`)
            cy.inputType("event-price", `${editEventRequest.price}`)
            cy.intercept("PUT", `/api/event/create/submit`).as("edit-event")
            cy.clickButton("edit-event-button", "Submit Edition")

            cy.wait("@edit-event").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/event/create/submit`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "PUT",
                        reqBody: "@editEventRequests",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@newEvent",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
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
                                "content-type": "application/json",
                            },
                            method: "GET",
                        },
                        {
                            status: 200,
                            expectRequest: {
                                keys: eventKeys,
                                object: editEventRequest,
                            },
                            build: {
                                object: "@newEvent",
                            },
                        }
                    )
                })

            cy.get("@newEvent").then((event: any) => {
                cy.url().should("include", `${event._id}`)
                cy.checkEventComponentProps(event)
            })
            cy.clickButton("viper", "viper", `/`)
            cy.log("End of first round")
        })
        // ==========middle IT
        it("starts a new round", () => {
            cy.log("2nd Round")
            cy.clickButton("nav-item", "Events", `/events`)
            cy.url().should("include", `/events`)
            cy.clickButton("tab-item", "Music", `/events/music`)
            cy.url().should("include", `/events/music`)
            cy.getByData("display-events").should("exist").eq(0)
            cy.getByData("select-event").click()
            cy.url()
                .should((url) => {
                    expect(url).to.match(/\/[a-f\d]{24}$/)
                })
                .then((url) => {
                    const id = url.split("/").pop()
                    cy.wrap(event)
                        .then((selectedEvent: any) => {
                            selectedEvent._id = id
                        })
                        .as("selectedEvent")
                })
            cy.get("@selectedEvent").then((selectedEvent: any) => {
                cy.apiRequestAndResponse(
                    {
                        url: `/api/event/${selectedEvent._id}`,
                        headers: {
                            "content-type": "application/json",
                        },
                        method: "GET",
                    },
                    {
                        status: 200,
                        expectRequest: {
                            // We are only expecting the keys,
                            // Most probably gotta expect an object as well
                            // if not , check the command, will crash 102%
                            keys: eventKeys,
                        },
                        build: {
                            object: selectedEvent,
                        },
                    }
                )
                cy.checkEventComponentProps(selectedEvent)
                cy.clickButton("participate", "Participate", `/${selectedEvent._id}/customer`)
                cy.url().should("contain", `/${selectedEvent._id}/customer`)
            })

            cy.inputType("password", password)
            cy.inputType("phone", customerEntries.typePhone)
            cy.inputType("address", customerEntries.typeAddress)
            cy.inputType("city", customerEntries.typeCity)
            cy.inputType("province", customerEntries.typeProvince)
            cy.inputType("zip-code", customerEntries.typeZipCode)
            cy.inputType("country", customerEntries.typeCountry)
            cy.intercept("POST", `/api/customer/create-shopify`).as("customer-shopify")
            cy.intercept("POST", `/api/customer/create-access-token`).as("access-token")
            cy.intercept("POST", `/api/customer/create-address`).as("@create-address")
            cy.intercept("PUT", `/api/customer/update-viper`).as("@update-viper")
            cy.clickButton("create-customer", "Create Customer")
            cy.wait("@customer-shopify").then((interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                expect(statusCode).eq(200)
                expect(responseBody.userErrors).to.be.an("array").that.is.empty
                expect(responseBody.customer._id).to.be.a("string")
                cy.wrap(customerEntries)
                    .then((customer) => {
                        customer.customerId = responseBody.customer._id
                    })
                    .as("customerEntries")
            })
            cy.wait("@access-token").then((interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                expect(statusCode).eq(200)
                expect(responseBody.accessToken).to.be.a("string")
                cy.wrap(customerEntries)
                    .then((customer) => {
                        customer.customerAccessToken = responseBody.accessToken
                    })
                    .as("customerEntries")
            })
            cy.wait("@create-address").then((interception) => {
                const statusCode = interception.response!.statusCode
                const responseBody = interception.response!.body
                const newAddress = responseBody.newAddress
                expect(statusCode).eq(200)
                expect(newAddress.customerUserErrors).to.be.an("array").that.is.empty
                expect(newAddress.customerAddress.id).to.be.a("string")
            })
            // in here check whats going on
            cy.get("@customerEntries").then((customer: any) => {
                cy.get("@profile").then((viper: any) => {
                    customer._id = viper._id
                })
            })
            cy.wait("@update-viper").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/update-viper`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "PUT",
                        reqBody: "@customerEntries",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@profile",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    }
                )
            })

            cy.apiRequestAndResponse(
                {
                    url: `/api/viper/${viper._id}`,
                    headers: {
                        "content-type": "application/json",
                    },
                    method: "GET",
                },
                {
                    status: 200,
                    expectRequest: {
                        keys: viperKeys,
                    },
                    build: {
                        object: viper,
                    },
                }
            )
            cy.get("@selectedEvent").then((selectedEvent: any) => {
                // Leave this url for the full run
                cy.url().should("contain", `${selectedEvent._id}`)
            })

            cy.intercept("POST", `/api/shopify/create-checkout`).as("create-checkout")
            cy.intercept("POST", `/api/customer/associate-checkout`).as("associate-checkout")
            cy.intercept("PUT", `/api/event/request-participation`).as("request-participation")
            cy.clickButton("participate", "Participate")
            cy.get("@selectedEvent").then((selectedEvent: any) => {
                cy.wait("@create-checkout").then((interception) => {
                    const statusCode = interception.response!.statusCode
                    const responseBody = interception.response!.body
                    const checkout = responseBody.checkout.edges[0].node
                    expect(statusCode).eq(200)
                    expect(responseBody.id).to.be.a("string")
                    expect(responseBody.webUrl).to.be.a("string")
                    expect(checkout.id).to.be.a("string")
                    expect(checkout.title).eq(selectedEvent.title)
                    expect(checkout.variant.title).to.be.a("string")
                    expect(checkout.product.handle).to.be.a("string")
                    expect(checkout.quantity).eq(1)
                    cy.wrap(checkoutEntries)
                        .then((checkoutEntries) => {
                            // this will be used in the request assertion
                            checkoutEntries._id = selectedEvent._id
                            checkoutEntries.checkoutId = checkout.id
                            checkoutEntries.webUrl = checkout.webUrl
                        })
                        .as("checkoutEntries")
                })
            })

            cy.wait("@associate-checkout").then((interception) => {
                const responseBody = interception.response!.body
                const checkout = responseBody.checkout
                expect(checkout.id).to.eq(checkoutEntries.checkoutId)
                expect(checkout.webUrl).to.eq(checkoutEntries.webUrl)
                expect(checkout.orderStatusUrl).to.be.null
                expect(responseBody.checkoutUserErrors).to.be.an("array").that.is.empty
                expect(responseBody.customer.id).eq(viper.shopify.customerId)
            })
            cy.wait("@request-participation").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/update-viper`,
                        reqHeaders: {
                            "content-type": "application/json",
                        },
                        reqMethod: "PUT",
                        reqBody: "@checkoutEntries",
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": "application/json; charset=utf-8",
                        },
                        resBody: "@profile",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    }
                )
            })
        })
    })
})
