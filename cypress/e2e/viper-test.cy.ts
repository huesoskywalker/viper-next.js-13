/* global window */
/// <reference path="../types.d.ts" />

import { username, password, content_type } from "../support/entryPoint"
import { rawViperBasicProps, _ID } from "../support/myApp/viper"
import {
    requestCreateEvent,
    requestEditProfile,
    requestEditEvent,
    requestCreateBlog,
    requestCustomerAddress,
    requestChatContact,
} from "../support/request/requestObjects"
import { viperBasicKeys, _idKey, myBlogKeys, viperKeys } from "../support/myApp/viperKeys"
import { eventKeys } from "../support/myApp/eventKeys"
import { Session } from "../support/myApp/session"
import { Chats, Hex24String, MyBlog, Viper, ViperBasicProps } from "@/types/viper"
import { Comments, EventInterface } from "@/types/event"
import { formatDistanceToNow } from "date-fns"
import { Alias } from "../support/commands"
import { rawChatKeys } from "../support/myApp/chatsKeys"
import { rawChat } from "../support/myApp/chats"
import { EditEvent, ProfileEdit } from "../support/request/requestTypes"

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
                cy.buildFullViper(session as Session, "profile")
                cy.navigate("nav-item", session.name, `/profile`)
                cy.checkProfileComponent("@profile" as Alias<string>, "Edit Profile")
                cy.navigate("edit-profile", "Edit Profile", `/profile/edit/${session._id}`)
                cy.editProfile(
                    requestEditProfile as ProfileEdit,
                    "@profile" as Alias<string>,
                    session._id as Hex24String
                )
            })
            cy.url().should("include", "/profile")
            cy.get<Viper>("@profile").then((viper: Viper) => {
                cy.checkProfileComponent(viper as Viper, "Edit Profile")

                cy.createBlog(requestCreateBlog.content, { _id: viper._id }, viper as Viper)
            })

            // Checking endpoints
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
                        expectResponse: {
                            keys: myBlogKeys,
                            object: requestCreateBlog,
                        },
                        build: {
                            object: viper,
                            path: "blog.myBlog[0]",
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
                        expectResponse: {
                            keys: myBlogKeys,
                            object: "@profile",
                            path: "blog.myBlog[0]",
                        },
                    }
                )

                cy.get<Viper>("@profile").then((viper: Viper) => {
                    cy.checkCommentCardComponent(
                        session as Session,
                        viper.blog.myBlog[0] as MyBlog,
                        requestCreateBlog.comment
                    )

                    cy.likeCommentCard(viper.blog.myBlog[0] as MyBlog, ["@profile", "@profile"])

                    cy.checkCommentCardComponent(
                        session as Session,
                        viper.blog.myBlog[0] as MyBlog
                    )
                    cy.getByData("like-blog")
                        .eq(0)
                        .invoke("css", "color")
                        .should("equal", "rgb(185, 28, 28)")
                    cy.getCookies().then((cookies) => {
                        expect(cookies[2]).to.have.property("value", "red")
                    })
                })
            })

            cy.log(`Dashboard`)

            cy.navigate("nav-item", "Dashboard", `/dashboard`)
            cy.navigate("tab-myevents", "My Events", `/dashboard/myevents`)
            cy.navigate("tab-create", "Create Event", `/dashboard/myevents/create`)

            cy.createEvent(requestCreateEvent, "@session", "@profile", "newEvent")

            cy.clickButton("preview-button", "Preview")
            cy.window().scrollTo("bottom")

            cy.checkEventComponentProps("@newEvent")

            cy.window().scrollTo("top")

            cy.navigate("tab-myevents", "My Events", `/dashboard/myevents`)
            // Checking endpoint
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
                        expectResponse: {
                            keys: eventKeys,
                            object: "@newEvent",
                        },
                    }
                )
            })

            cy.getByData("display-events").should("exist").and("be.visible").first()
            cy.getByData("event-card-image").should("exist").and("be.visible").first()

            cy.checkEventCard("@newEvent" as Alias<string>, requestEditEvent as EditEvent)

            cy.get<EventInterface>("@newEvent").then((event: EventInterface) => {
                cy.url()
                    .should((url) => {
                        expect(url).to.match(/\/[a-f\d]{24}$/)
                    })
                    .then((url) => {
                        const eventId = url.split("/").pop()
                        expect(eventId).to.deep.equal(event._id)
                    })
                cy.checkEventComponentProps(event as EventInterface)
            })

            cy.navigate("viper", "viper", "/")
            // =============Music Event
            cy.log(`Music Event`)

            cy.navigate("nav-item", "Events", `/events`)
            cy.navigate("tab-Music", "Music", `/events/Music`)

            cy.getByData("display-events").should("exist").eq(0)
            cy.getByData("select-event").click()

            cy.buildEventFromUrl("selectedEvent")

            cy.checkEventComponentProps("@selectedEvent")

            cy.get<_ID>("@selectedEventId").then((event: _ID) => {
                cy.navigate("participate-customer", "Participate", `/${event._id}/customer`)
            })
            cy.createCustomer(password, requestCustomerAddress, "@session", "@profile")

            cy.participateEvent("@selectedEvent", "@profile")

            cy.get<EventInterface>("@selectedEvent").then((event: EventInterface) => {
                cy.reload()
                cy.url().should("contain", `/${event._id}`)

                cy.checkEventComponentProps(event as EventInterface)

                cy.claimEventCard(event as EventInterface, "@profileId")
            })

            cy.navigate("nav-item", "Dashboard", `/dashboard`)
            cy.navigate("tab-myevents", "My Events", `/dashboard/myevents`)
            cy.navigate("tab-collection", "Collection", `/dashboard/myevents/collection`)
            cy.checkCollectionEventCard("@selectedEvent")
            // ===========================In here we start with a new event,
            cy.navigate("nav-item", "Events", `/events`)
            cy.navigate("tab-Bars", "Bars", `/events/Bars`)
            cy.getByData("display-events").should("exist").eq(0)
            cy.getByData("select-event").click()

            cy.buildEventFromUrl("likedEvent")

            cy.likeEvent(["@likedEvent", "@profile"])

            cy.commentEvent(
                "seeee y'all there !",
                "@likedEvent" as Alias<string>,
                "@profileId" as Alias<string>
            )

            cy.get<EventInterface>("@likedEvent").then((event: EventInterface) => {
                cy.checkEventCommentCard(
                    "@session" as Alias<string>,
                    event.comments[0] as Comments,
                    event.title
                )
                cy.likeEventCommentCard("@profileId" as Alias<string>, event)
            })

            // building the organizer profile
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
                        expectResponse: {
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

            cy.displayViper("@likedEventOrganizer")

            cy.addFollow("@profile", "@likedEventOrganizer")

            cy.wait(300)
            cy.get<ViperBasicProps>("@likedEventOrganizer").then((organizer: ViperBasicProps) => {
                cy.navigate(
                    "display-organizer-name",
                    organizer.name,
                    `/dashboard/vipers/${organizer._id}`
                )
                // ===============PROFILE
                cy.checkProfileComponent(organizer as ViperBasicProps, "Following")

                // building full organizer profile
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
                        expectResponse: {
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
                            expectResponse: {
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
