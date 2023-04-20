import {
    BlogRequest,
    CreateEventRequest,
    EditEventRequest,
    LikeBlog,
    ProfileEdit,
} from "./requestTypes"

export const profileEditRequest: ProfileEdit = {
    name: "Hueso Skywalker",
    biography: "Hey ho, let's go",
    image: "",
    backgroundImage: "",
    location: "Greece",
}

export const typeDate: string = "2023-08-28"
export const typeTime: string = "20:00:00"

export const createEventRequest: CreateEventRequest = {
    title: "Rook's Paper's Scissor's",
    content: "Let's go an play, best of three for a Pizza Slice",
    category: "Music",
    date: `${typeDate}T${typeTime}.000Z`,
    location: "Argentina",
    address: "St. German Boulevard, 34",
    price: 3,
    entries: 100,
    organizer: {
        _id: "",
        name: "",
        email: "",
    },
    image: "",
    productId: "",
}

export const editEventRequest: EditEventRequest = {
    title: "Cypress hill",
    content: "Groove till the moon",
    location: "Italy",
    price: 34,
}

export const blogRequest: BlogRequest = {
    _id: "",
    content: "Cypress is a pretty cool feature",
}

export const likeBlogRequest: LikeBlog = {
    _id: "",
    blogOwner_id: "",
    viper_id: "",
}
