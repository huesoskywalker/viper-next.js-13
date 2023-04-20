import { createEventRequest } from "./requestObjects"
import { NewEventId, ProductId, ProductMedia, PublishProduct } from "./responseTypes"

export const responseProductMedia: ProductMedia = {
    media: { mediaContentType: "IMAGE", status: "UPLOADED" },
    product: {
        title: createEventRequest.title,
    },
}

export const responseProductId: ProductId = {
    productId: "",
}

export const responsePublishProduct: PublishProduct = {
    publishable: {
        publishedOnCurrentPublication: true,
    },
    shop: {
        url: `https://vipers-go.myshopify.com`,
        // url: `https://${process.env.SHOPIFY_HOST}`,
    },
    userErrors: [],
}

export const responseNewEvent: NewEventId = {
    insertedId: "",
    acknowledged: true,
}
