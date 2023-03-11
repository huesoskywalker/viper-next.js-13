import { ObjectId } from "mongodb"
import { NODE_CHECKOUT_QUERY } from "../graphql/query/nodeCheckout"
import { storefrontClient } from "../lib/storefrontApi"
import { Collection, Viper } from "../lib/vipers"
import { Checkout } from "@shopify/shopify-api/rest/admin/2023-01/checkout"
import { FulfillmentOrder } from "@shopify/shopify-api/rest/admin/2023-01/fulfillment_order"
import { RequestReturn } from "@shopify/shopify-api"

const isCheckoutFulFilled = async (
    viper: Viper,
    eventId: string
): Promise<FulfillmentOrder | undefined> => {
    const map: Collection[] = viper.collection.map((collection: Collection) => {
        return {
            _id: collection._id,
            checkoutId: collection.checkoutId,
        }
    })
    const find: Collection | undefined = map.find(
        (collection: Collection) => collection._id === new ObjectId(eventId)
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
