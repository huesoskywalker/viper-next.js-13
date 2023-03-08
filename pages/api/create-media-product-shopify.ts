import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { MEDIA_CREATE } from "../../graphql/mutation/productCreateMedia"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )
    const client = new shopifyAdmin.clients.Graphql({ session })

    const MEDIA_INPUT = {
        media: {
            alt: "imagen cule",
            mediaContentType: "IMAGE",
            originalSource: body.resourceUrl,
        },
        productId: body.productId,
    }

    const updatedProduct = await client.query({
        data: {
            query: MEDIA_CREATE,
            variables: MEDIA_INPUT,
        },
    })
    return res.status(200).json(updatedProduct)
}
