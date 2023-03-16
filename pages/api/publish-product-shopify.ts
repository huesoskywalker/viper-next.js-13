import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { PRODUCT_PUBLISH } from "../../graphql/mutation/publishablePublish"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const productId: string = body.productId
    const viperApp: string = body.viperApp

    if (req.method === "POST") {
        try {
            const session = shopifyAdmin.session.customAppSession(
                "vipers-go.myshopify.com"
            )
            const client = new shopifyAdmin.clients.Graphql({ session })

            const PRODUCT_INPUT = {
                id: productId,
                input: {
                    publicationId: viperApp,
                },
            }
            const publishProduct = await client.query({
                data: {
                    query: PRODUCT_PUBLISH,
                    variables: PRODUCT_INPUT,
                },
            })

            return res.status(200).json(publishProduct)
        } catch (error: any) {
            return res.status(400).json(error)
        }
    }
}
