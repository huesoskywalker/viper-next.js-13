import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { MEDIA_CREATE } from "../../graphql/mutation/productCreateMedia"
import { RequestReturn } from "@shopify/shopify-api"
import { Product } from "@shopify/shopify-api/rest/admin/2023-01/product"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const resourceUrl: string = body.resourceUrl
    const productId: string = body.productId
    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )
    const client = new shopifyAdmin.clients.Graphql({ session })

    const MEDIA_INPUT = {
        media: {
            alt: "product image",
            mediaContentType: "IMAGE",
            originalSource: resourceUrl,
        },
        productId: productId,
    }

    const updatedProduct: RequestReturn<Product> = await client.query({
        data: {
            query: MEDIA_CREATE,
            variables: MEDIA_INPUT,
        },
    })
    return res.status(200).json(updatedProduct)
}
