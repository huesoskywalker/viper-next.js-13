// import { NextResponse } from "next/server"
// import { NODE_CHECKOUT_QUERY } from "../../graphql/query/nodeCheckout"
// import { storefrontClient } from "../../lib/storefrontApi"
// import { Viper } from "../../lib/vipers"

// export const revalidate = 30

// export async function POST(viper: Viper, eventId: string) {
//     const map = viper.participated.map((participated: any) => {
//         return {
//             _id: JSON.stringify(participated._id).slice(1, -1),
//             checkoutId: participated.checkoutId,
//         }
//     })
//     const find = map.find((participated) => participated._id === eventId)

//     if (!find) return new Response(null)

//     const CHECKOUT_INPUT = {
//         id: find.checkoutId,
//     }

//     const checkout = await storefrontClient.query({
//         data: {
//             query: NODE_CHECKOUT_QUERY,
//             variables: CHECKOUT_INPUT,
//         },
//     })

//     const checkoutOrder = checkout.body.data.node.order
//     if (!checkoutOrder) return false

//     // return {
//     //     fulfillmentStatus: checkout.body.data.node.order.fulfillmentStatus,
//     //     financialStatus: checkout.body.data.node.order.financialStatus,
//     // }
//     // return checkoutOrder.financialStatus
//     // return new NextResponse(checkoutOrder)
//     return NextResponse.json(checkout.headers)
// }
