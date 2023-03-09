import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { PRODUCT_PUBLISH } from "../../graphql/mutation/publishablePublish"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )
    const client = new shopifyAdmin.clients.Graphql({ session })

    const PRODUCT_INPUT = {
        id: body.productId,
        input: {
            publicationId: body.viperApp,
        },
    }
    const publishProduct = await client.query({
        data: {
            query: PRODUCT_PUBLISH,
            variables: PRODUCT_INPUT,
        },
    })

    return res.status(200).json(publishProduct)
}
