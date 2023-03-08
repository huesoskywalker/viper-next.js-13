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
            //This have to be activated first
            // giftCard: true,
            handle: body.title,
            // SEARCH  ENGINE LISTING
            seo: {
                title: body.title,
                description: body.description,
            },
            // templateSuffix: "got no idea about This",
            productType: "Event Card",
            vendor: body.organizer,
            // images: [
            //     {
            //         altText: "Event Image",
            //         id: "whatevefornow",
            //         src: "../../public/upload/61ccc1a5955155c62d2da3802.jpg",
            //     },
            // ],
            variants: [
                {
                    // id: "",

                    price: body.price,
                    // sku: "string"
                    // this not working buh
                    imageSrc: body.resourceUrl,
                    inventoryItem: { cost: body.price, tracked: true },

                    inventoryPolicy: "DENY",
                    // IF ERROR REMOVE STATUS ========================================================================================
                    // status: "ACTIVE",
                    // inventoryQuantities: [
                    //     {
                    //         availableQuantity: body.entries,
                    //         locationId: body.location,
                    //     },

                    // ],
                    //---------------------------------------

                    inventoryQuantities: {
                        availableQuantity: Number(body.entries),
                        locationId: "gid://shopify/Location/78320468258",
                    },
                    // productId: "gid://shopify/Product/108828309",
                    requiresShipping: false,
                    options: "viper-level-1",
                    taxable: false,
                    //--------------------------------
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
