import { NextResponse } from "next/server"
// import { shopifyAdmin } from "../../lib/adminApi"
import { storefrontClient } from "../lib/storefrontApi"
import PRODUCT_INVENTORY_GET from "../graphql/query/productInventory"

export const productInventoryCount = async (productId: string) => {
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
}
