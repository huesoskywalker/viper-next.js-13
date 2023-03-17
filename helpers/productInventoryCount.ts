import "server-only"
import { storefrontClient } from "../lib/storefrontApi"
import PRODUCT_INVENTORY_GET from "../graphql/query/productInventory"
import { InventoryItem } from "@shopify/shopify-api/rest/admin/2023-01/inventory_item"
import { RequestReturn } from "@shopify/shopify-api"

export const productInventoryCount = async (
    productId: string
): Promise<InventoryItem> => {
    const PRODUCT_INPUT = {
        id: productId,
    }

    const productInventory: RequestReturn<InventoryItem> =
        await storefrontClient.query({
            data: {
                query: PRODUCT_INVENTORY_GET,
                variables: PRODUCT_INPUT,
            },
        })
    // if (!productInventory) return false

    return productInventory.body.data.product
}
