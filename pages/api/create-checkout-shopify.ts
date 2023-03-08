import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { loadSession } from "../../lib/shopifySessionStorage"
import PRODUCT_GET from "../../graphql/query/product"
import { storefrontClient } from "../../lib/storefrontApi"
import { CHECKOUT_CREATE } from "../../graphql/mutation/checkoutCreate"

const checkoutCreate = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body
    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )

    const client = new shopifyAdmin.clients.Graphql({ session })

    const PRODUCT_INPUT = {
        id: body.productId,
    }

    const product = await client.query({
        data: {
            query: PRODUCT_GET,
            variables: PRODUCT_INPUT,
        },
    })
    // WE GOTTA MAKE INTERFACES
    const variantId = product.body!.data.product.variants.edges[0].node.id
    console.log(`-----------------variantId-------------------`)
    console.log(variantId)

    const CHECKOUT_INPUT = {
        input: {
            allowPartialAddresses: true,
            email: body.viperEmail,

            lineItems: [
                {
                    variantId: variantId,
                    quantity: 1,
                },
            ],
        },
    }

    const checkout = await storefrontClient.query({
        data: {
            query: CHECKOUT_CREATE,
            variables: CHECKOUT_INPUT,
        },
    })

    return res.status(200).json(checkout)
}

export default checkoutCreate
