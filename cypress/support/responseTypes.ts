export type ProductMedia = {
    media: { mediaContentType: string; status: string }
    product: {
        title: string
    }
}

export type ProductId = {
    productId: string
}

export type PublishProduct = {
    publishable: {
        publishedOnCurrentPublication: boolean
    }
    shop: {
        url: string
    }
    userErrors: Array<object>
}

export type NewEventId = {
    insertedId: string
    acknowledged: boolean
}
