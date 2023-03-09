import { NODE_CHECKOUT_QUERY } from "../graphql/query/nodeCheckout"
import { storefrontClient } from "../lib/storefrontApi"
import { Collection, Viper } from "../lib/vipers"

const isCheckoutFulFilled = async (viper: Viper, eventId: string) => {
    const map = viper.collection.map((collection: Collection) => {
        return {
            _id: JSON.stringify(collection._id).slice(1, -1),
            checkoutId: collection.checkoutId,
        }
    })
    const find = map.find((collection) => collection._id === eventId)

    if (!find) return false

    const CHECKOUT_INPUT = {
        id: find.checkoutId,
    }

    const checkout = await storefrontClient.query({
        data: {
            query: NODE_CHECKOUT_QUERY,
            variables: CHECKOUT_INPUT,
        },
    })

    const checkoutOrder = checkout.body.data.node.order
    if (!checkoutOrder) return false

    return checkoutOrder.financialStatus
}
export default isCheckoutFulFilled
