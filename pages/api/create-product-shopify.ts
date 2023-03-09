import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { PRODUCT_CREATE } from "../../graphql/mutation/productCreate"

const productCreate = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body
    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )
    const client = new shopifyAdmin.clients.Graphql({ session })

    const PRODUCT_INPUT = {
        input: {
            collectionsToJoin: "gid://shopify/Collection/437054996770",
            title: body.title,
            descriptionHtml: body.description,
            handle: body.title,
            seo: {
                title: body.title,
                description: body.description,
            },
            productType: "Event Card",
            vendor: body.organizer,

            variants: [
                {
                    price: body.price,
                    // sku: "string"
                    imageSrc: body.resourceUrl,
                    inventoryItem: { cost: body.price, tracked: true },
                    inventoryPolicy: "DENY",
                    inventoryQuantities: {
                        availableQuantity: Number(body.entries),
                        locationId: "gid://shopify/Location/78320468258",
                    },
                    // productId: "gid://shopify/Product/108828309",
                    requiresShipping: false,
                    options: "viper-level-1",
                    taxable: false,
                },
            ],
        },
    }

    const newProduct = await client.query({
        data: {
            query: PRODUCT_CREATE,
            variables: PRODUCT_INPUT,
        },
    })

    return res.status(200).json(newProduct)
}

export default productCreate
