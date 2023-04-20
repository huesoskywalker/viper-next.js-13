import { createEventRequest } from "./requestObjects"

export const username = "Hueso Skywalker"
export const password = "viperApp"

type File = {
    data: {
        url: string
        fileName: string
        fileSize: string
        fileType: string
    }
}

export const imageFile: File = {
    data: {
        url: "",
        fileName: "",
        fileSize: "",
        fileType: "",
    },
}
type StageUpload = {
    stageUpload: {
        url: string
        parameters: object[]
        resourceUrl: string
    }
}
export const stageUploadCreate: StageUpload = {
    stageUpload: {
        parameters: [],
        url: "",
        resourceUrl: "",
    },
}
type ProductShopify = {
    organizer: string
    resourceUrl: string
    title: string
    description: string
    location: string
    address: string
    category: string
    price: number | string
    entries: number | string
}
export const productShopify: ProductShopify = {
    organizer: "",
    resourceUrl: "",
    title: createEventRequest.title,
    description: createEventRequest.content,
    location: createEventRequest.location,
    address: createEventRequest.address,
    category: createEventRequest.category,
    price: createEventRequest.price.toString(),
    entries: createEventRequest.entries.toString(),
}

type CustomerEntries = {
    _id: string
    typePhone: string
    typeAddress: string
    typeCity: string
    typeProvince: string
    typeZipCode: string
    typeCountry: string
    customerId: string
    customerAccessToken: string
    // [key: string]: any
}
export const customerEntries: CustomerEntries = {
    _id: "",
    typePhone: `+5493543555713`,
    typeAddress: `Los Algarrobos`,
    typeCity: `Los Hornillos`,
    typeProvince: `Córdoba`,
    typeZipCode: `5100`,
    typeCountry: `Argentina`,
    customerId: "",
    customerAccessToken: "",
}

type Checkout = {
    _id: string
    checkoutId: string
    webUrl: string
}
export const checkoutEntries: Checkout = {
    _id: "",
    checkoutId: "",
    webUrl: "",
}

type productMedia = {
    productId: string
    resourceUrl: string
}

export const createProductMedia: productMedia = {
    productId: "",
    resourceUrl: "",
}
