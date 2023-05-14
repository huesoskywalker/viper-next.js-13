import { rawProduct } from "../myApp/event"
import { ID } from "../myApp/viper"
import {
    Comment,
    CreateEvent,
    EditEvent,
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
    location: "Argentina",
}

export const typeDate: string = "2023-08-28"
export const typeTime: string = "20:00:00"

export const requestCreateEvent: CreateEvent = {
    title: "Le Femmes",
    content: "Baila como una serpiente antes de tentar a un profeta",
    category: "Art",
    date: `${typeDate}T${typeTime}.000Z`,
    location: "Argentina",
    address: "Carrer de Petons, 3, Barcelona, 08001",
    price: 23,
    entries: 100,
    organizer: {
        _id: "",
        name: "",
        email: "",
    },
    image: "",
    product: rawProduct,
}

export const requestEditEvent: EditEvent = {
    title: "Le Femmes, Fatale",
    content: "Groove till the moon",
    location: "Spain",
    price: 34,
}

export const requestCreateBlog: ID = {
    content: "Cypress is a pretty cool feature",
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
