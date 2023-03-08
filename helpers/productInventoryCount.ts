import { NextResponse } from "next/server"
// import { shopifyAdmin } from "../../lib/adminApi"
import { storefrontClient } from "../lib/storefrontApi"
import PRODUCT_INVENTORY_GET from "../graphql/query/productInventory"

export const productInventoryCount = async (productId: string) => {
    // const session = shopifyAdmin.session.customAppSession(
    //     "vipers-go.myshopify.com"
    // )
    // const client = new shopifyAdmin.clients.Graphql({ session })

    const PRODUCT_INPUT = {
        id: productId,
    }
    const gql = String.raw

    const productInventory = await storefrontClient.query({
        data: {
            query: PRODUCT_INVENTORY_GET,
            variables: PRODUCT_INPUT,
        },
    })
    // if (!productInventory) return false

    return productInventory.body.data.product
    // return NextResponse.json({
    //     response: productInventory.body.data.product.totalInventory,
    // })
}
