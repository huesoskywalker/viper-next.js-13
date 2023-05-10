import { rawProduct } from "../myApp/event"
import { ID } from "../myApp/viper"
import {
    Comment,
    CreateEvent,
    EditEventRequest,
    File,
    LikeBlog,
    ProfileEdit,
    ProductMedia,
    ProductShopify,
    CustomerAddress,
} from "./requestTypes"

export const requestEditProfile: ProfileEdit = {
    name: "Hueso Skywalker",
    biography: "Hey ho, let's go",
    image: "",
    backgroundImage: "",
    location: "Greece",
}

export const typeDate: string = "2023-08-28"
export const typeTime: string = "20:00:00"

export const requestCreateEvent: CreateEvent = {
    title: "Rook's Paper's Scissor's",
    content: "Let's go an play, best of three for a Pizza Slice",
    category: "Art",
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
    product: rawProduct,
}

export const requestEditEvent: EditEventRequest = {
    title: "Cypress hill",
    content: "Groove till the moon",
    location: "Italy",
    price: 34,
}

export const requestCreateBlog: Comment = {
    comment: "Cypress is a pretty cool feature",
}

export const requestLikeBlog: LikeBlog = {
    _id: "",
    blogOwner_id: "",
    viper_id: "",
}

export const requestEventImage: File = {
    data: {
        url: "",
        fileName: "",
        fileSize: "",
        fileType: "",
    },
}

export const requestProductMedia: ProductMedia = {
    product: {
        _id: "",
        variant_id: "",
    },
    resourceUrl: "",
}

export const requestCustomerAddress: CustomerAddress = {
    phone: `+5493543555713`,
    address: `Los Algarrobos`,
    city: `Los Hornillos`,
    province: `Córdoba`,
    zip: `5100`,
    country: `Argentina`,
}

export const requestProductShopify: ProductShopify = {
    organizer: "",
    resourceUrl: "",
    title: requestCreateEvent.title,
    description: requestCreateEvent.content,
    location: requestCreateEvent.location,
    address: requestCreateEvent.address,
    category: requestCreateEvent.category,
    price: requestCreateEvent.price.toString(),
    entries: requestCreateEvent.entries.toString(),
}

export const requestCommentEvent: Comment = {
    comment: "see y'all there",
}

export const requestChatContact: ID = {
    message: "Hey pal, bla bla bla",
}
