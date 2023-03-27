/* global window */
/// <reference path="../types.d.ts" />

export {}

const viperId = "6420c36024eee4e8dba9c081"
const viperName = "Hueso Skywalker"
const password = "viperApp"
const comment = "Cypress is a pretty cool feature"
const biography = "One day or another, "
let imageUrl: string
let bgImageUrl: string
const location = "Italy"

describe("Profile Page", () => {
    beforeEach(() => {
        cy.signInWithCredential(viperName, password)
    })
    context("Goes to the Profile and interact", () => {
        it("Creates a blog", () => {
            cy.log(`Profile`)
            cy.getByData("nav-item").contains(viperName).click()
            cy.url().should("include", "/profile")
            cy.getByData("edit-profile").click()
            cy.url().should("include", `/profile/edit/${viperId}`)
            cy.getByData("new-name").clear().type(viperName)
            cy.getByData("new-biography").clear().type(biography)
            cy.intercept("PUT", "/api/viper/update-profile-image").as(
                "profile-image"
            )
            cy.getByData("new-profile-image").selectFile([
                {
                    contents: "cypress/fixtures/images/myprofile.jpeg",
                    fileName: "myprofile.jpeg",
                    mimeType: "image/jpeg",
                    lastModified: new Date("Feb 18 2023").valueOf(),
                },
            ])
            cy.getByData("accept-profile-image").click()
            cy.intercept("PUT", "/api/viper/update-background-image").as(
                "background-image"
            )
            cy.getByData("new-background-image").selectFile([
                {
                    contents: "cypress/fixtures/images/egypt.jpg",
                    fileName: "egypt.jpg",
                    mimeType: "image/jpg",
                    lastModified: new Date("Feb 18 2023").valueOf(),
                },
            ])
            cy.getByData("new-location")
                .select(location)
                .should("have.value", location)
            cy.intercept("PUT", "/api/viper/edit").as("edit-viper")
            cy.getByData("submit-button").click()
            cy.wait("@profile-image").then((interception) => {
                const response = interception.response!
                const data = response.body.data
                expect(response.statusCode).eq(200)
                expect(data).to.exist
                expect(data.url).to.be.a("string")
                imageUrl = data.url
            })
            cy.wait("@background-image").then((interception) => {
                const response = interception.response!
                const bgData = response.body.bgData
                expect(response.statusCode).eq(200)
                expect(bgData).to.exist
                expect(bgData.url).to.be.a("string")
                bgImageUrl = bgData.url
            })
            cy.wait("@edit-viper").then((interception) => {
                const response = interception.response!
                const value = response.body.value
                cy.log(value)
                expect(response.statusCode).eq(200)
                expect(value._id).eq(viperId)
                expect(value.name).eq(viperName)
                // expect(value.image).eq(imageUrl)
                cy.log(value.image)
                cy.log(imageUrl)
                expect(value.backgroundImage).eq(bgImageUrl)
                expect(value.biography).eq(biography)
                expect(value.location).eq(location)
            })

            // ==================This Uploads the image but the body: {}=============================
            // I'll let the body image as comment, and the blob is interesting, can be great to store images as blob

            cy.fixture("images/myprofile.jpeg").then((fileContent) => {
                const blob = new Blob([fileContent], { type: "image/jpeg" })
                const image = new FormData()
                image.append("file", blob)
                cy.api({
                    url: "/api/viper/update-profile-image",
                    method: "PUT",
                    body: image,
                }).then((response) => {
                    expect(response.status).to.equal(200)
                    expect(response.body).to.exist
                })
            })
            cy.fixture("images/egypt.jpg").then((fileContent) => {
                const blob = new Blob([fileContent], { type: "image/jpeg" })
                const backgroundImage = new FormData()
                backgroundImage.append("file", blob)
                cy.api({
                    url: "/api/viper/update-background-image",
                    method: "PUT",
                    body: backgroundImage,
                }).then((response) => {
                    expect(response.status).to.equal(200)
                    expect(response.body).to.exist
                })
            })
            cy.api({
                url: `/api/viper/id/${viperId}`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                const viper = response.body.viper
                expect(response.status).to.eq(200)
                expect(viper).to.not.be.null
                expect(viper._id).eq(viperId)
                expect(viper.name).eq(viperName)
                expect(viper.email).to.be.a("string")
                expect(viper.image).to.be.a("string").eq(imageUrl)
                expect(viper.backgroundImage).to.be.a("string").eq(bgImageUrl)
                expect(viper.biography).eq(biography)
                expect(viper.location).eq(location)
                expect(viper).to.have.all.keys(
                    "_id",
                    "name",
                    "email",
                    "image",
                    "emailVerified",
                    "followers",
                    "follows",
                    "backgroundImage",
                    "biography",
                    "blog",
                    "blogCommented",
                    "blogLikes",
                    "blogRePosts",
                    "location"
                )
            })
            cy.url().should("include", "/profile")
            cy.wait(1000)
            cy.reload()
            cy.getByData("profileImage").should("be.visible")
            cy.getByData("backgroundImage").should("be.visible")
            cy.getByData("name").contains(viperName).should("be.visible")
            cy.getByData("location").contains(location).should("be.visible")
            cy.getByData("biography").contains(biography).should("be.visible")
            cy.log("Success edit")
            // ======================BLOG=================================================
            cy.getByData("blog-button").click()
            cy.getByData("commentInput").should("exist")
            cy.getByData("add-comment").type(comment)
            cy.getByData("post-blog").click()
            cy.getByData("commentInput").should("not.exist")
            cy.api({
                url: "/api/viper/blog/all",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    viperId: viperId,
                },
            })
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.be.greaterThan(0)
                    expect(response.body[0].content).eq(comment)
                })
                .its("body")
                .each((value) => {
                    return expect(value).to.have.all.keys(
                        "_id",
                        "content",
                        "likes",
                        "comments",
                        "rePosts",
                        "timestamp"
                    )
                })
            cy.getByData("blog-viperName")
                .should("be.visible")
                .contains(viperName)
            cy.getByData("success-blog").eq(0).should("contain", comment)

            cy.log("Success creating a Blog")
            // ------------------------------------------------------
            cy.getByData("like-blog").eq(0).click()
            cy.getByData("like-blog")
                .eq(0)
                .invoke("css", "color")
                .should("equal", "rgb(185, 28, 28)")
            cy.getCookies().then((cookies) => {
                expect(cookies[2]).to.have.property("value", "red")
            })
            cy.log("Successful Profile ")
        })
        it("Testing whats going on ", () => {
            cy.log(`Events`)
            cy.getByData("nav-item").contains("Events").click()
            cy.log("emmm yeah")
        })
    })
})

// it("Edit the profile", () => {
// cy.visit("/")
// cy.getByData("edit-profile").click()
// cy.url().should("include", "/profile/edit")
// })
// it.only("Interact with Events", () => {
//     cy.log(`Events`)
//     cy.getByData("nav-item").contains("Events").click()
//     cy.url().should("include", "/events")
//     cy.api("/api/event/all")
//         .its("body")
//         .then((body) => {
//             expect(body.length).to.be.length(19)
//             cy.log(body.length)
//         })
// })

// describe('other page tests', () => {
//     beforeEach(() => {
//       signInWithCredential(viperName, password)
//     })

//     it('should test something on the /other page', () => {
//       // assertions
//     })
//   })

// it('adds an item', () => {
//     const randomId = Cypress._.random(0, 10000)
//     const item = { id: randomId, task: 'life' }

//     add(item)
//     cy.request(`/todos/${randomId}`)
//     .its('body')
//     .should('deep.eq', item)
// })
