import checkoutCreate from "../graphql/query/mutation/checkoutCreate"
import orderById from "../graphql/query/order"
import productById from "../graphql/query/product"
import { shopifyFetch } from "../lib/shopifyFetch"

export default async function HomePage() {
    const a = await shopifyFetch(
        productById("gid://shopify/Product/8124267888930")
    )
    const variantId = "gid://shopify/ProductVariant/44482140242210"
    const b = await shopifyFetch(checkoutCreate(), { variantId })
    console.log(b.body.data.checkoutCreate.checkout)
    // console.log(b.body.data.checkoutCreate.checkout.lineItems.edges[0].node)
    const c = await shopifyFetch(orderById())
    // console.log(c.body)

    return (
        <div className="  space-y-8 mt-7">
            <h1 className="flex justify-center text-xl font-medium text-gray-300">
                Welcome to the best app in the world
            </h1>
            <p className="text-gray-400 flex justify-center">
                Find & organize Events, match people, have fun and enjoy
            </p>
        </div>
    )
}
// "gid://shopify/Product/8124267888930"
