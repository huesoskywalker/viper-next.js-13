import "server-only"

import { NODE_CHECKOUT_QUERY } from "@/graphql/query/nodeCheckout"
import { storefrontClient } from "@/lib/storefrontApi"
import { Collection } from "@/types/viper"
import { Checkout } from "@shopify/shopify-api/rest/admin/2023-01/checkout"
import { FulfillmentOrder } from "@shopify/shopify-api/rest/admin/2023-01/fulfillment_order"
import { RequestReturn } from "@shopify/shopify-api"
import { getViperCollectionEvents } from "@/lib/vipers"

const isCheckoutFulFilled = async (eventId: string): Promise<FulfillmentOrder | undefined> => {
    const viperCollection: Collection[] = await getViperCollectionEvents()

    if (!viperCollection) return
    const map: Collection[] = viperCollection.map((collection: Collection) => {
        return {
            _id: collection._id,
            checkoutId: collection.checkoutId,
        }
    })
    const find: Collection | undefined = map.find(
        (collection) => JSON.stringify(collection._id).replace(/['"]+/g, "") === eventId
    )
    if (!find) return

    const CHECKOUT_INPUT = {
        id: find.checkoutId,
    }

    const checkout: RequestReturn<Checkout> = await storefrontClient.query({
        data: {
            query: NODE_CHECKOUT_QUERY,
            variables: CHECKOUT_INPUT,
        },
    })

    const checkoutOrder: FulfillmentOrder = checkout.body.data.node.order

    if (!checkoutOrder) return

    return checkoutOrder
}
export default isCheckoutFulFilled
