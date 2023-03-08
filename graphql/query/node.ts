import { shopifyAdmin } from "../../lib/adminApi"
import { storefrontClient } from "../../lib/storefrontApi"
// gid://shopify/Checkout/8d9553e90559e380778644ffc90d66af?key=2115027692fea1ffcf492efc94d33d6c
export default async function runTest() {
    const gql = String.raw

    const QUERY = gql`
        query {
            node(
                id: "gid://shopify/Checkout/c1c18b5502127565d6f62ce0cdb56d58?key=93e4805773ed86d9ae6de3e6f0a3ce6c"
            ) {
                id
                ... on Checkout {
                    order {
                        # id
                        # orderNumber
                        # fulfillmentStatus
                        # statusUrl
                        id
                        name
                        orderNumber
                        processedAt
                        cancelReason
                        currentSubtotalPrice {
                            amount
                        }
                        currentTotalPrice {
                            amount
                        }
                        totalPriceV2 {
                            amount
                        }

                        # totalTaxV2 {
                        #     amount
                        # }
                        financialStatus
                        fulfillmentStatus
                        statusUrl

                        lineItems(first: 1) {
                            edges {
                                node {
                                    title
                                    quantity
                                    originalTotalPrice {
                                        amount
                                    }
                                    variant {
                                        id
                                        product {
                                            id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        # }

        # query {
        #     customers(first: 10) {
        #         edges {
        #             node {
        #                 id
        #             }
        #         }
        #     }
        # }

        # query {
        #     customer(id: "gid://shopify/Customer/6800984047906") {
        #         acceptsMarketing
        #         addresses(first: 5) {
        #             address1
        #         }
        #         averageOrderAmountV2 {
        #             amount
        #         }
        #         canDelete
        #         createdAt
        #         defaultAddress {
        #             address1
        #         }
        #         displayName
        #         email
        #         events(first: 5) {
        #             edges {
        #                 node {
        #                     message
        #                 }
        #             }
        #         }
        #         firstName
        #         hasNote
        #         hasTimelineComment
        #         id
        #         image {
        #             id
        #         }
        #         lastName
        #         legacyResourceId
        #         lifetimeDuration
        #         metafield(key: "app_key", namespace: "affiliates") {
        #             description
        #         }
        #         metafields(first: 5) {
        #             edges {
        #                 node {
        #                     id
        #                 }
        #             }
        #         }
        #         note
        #         orders(first: 5) {
        #             edges {
        #                 node {
        #                     id
        #                 }
        #             }
        #         }
        #         ordersCount
        #         phone
        #         state
        #         tags
        #         taxExempt
        #         totalSpent
        #         totalSpentV2 {
        #             amount
        #         }
        #         updatedAt
        #         validEmailAddress
        #         verifiedEmail
        #     }
        # }

        # query {
        #     customer(id: "gid://shopify/Customer/6800984047906") {
        #         id
        #         firstName
        #         lastName
        #         # acceptsMarketing
        #         email
        #         phone
        #         orders(first: 10) {
        #             edges {
        #                 node {
        #                     id
        #                     name
        #                     displayFulfillmentStatus
        #                     fullyPaid
        #                     confirmed
        #                     legacyResourceId
        #                     publication {
        #                         id
        #                         name
        #                         # collections(first: 10) {
        #                         #     edges {
        #                         #         node {
        #                         #             id
        #                         #             description
        #                         #         }
        #                         #     }
        #                         products(first: 10) {
        #                             edges {
        #                                 node {
        #                                     id
        #                                 }
        #                             }
        #                         }
        #                     }
        #                     # channelInformation
        #                     # sourceIdentifier
        #                 }
        #             }
        #         }
        #         events(first: 5) {
        #             edges {
        #                 node {
        #                     message
        #                 }
        #             }
        #         }
        #         # ordersCount
        #         # # totalSpentV2 {
        #         # #     amount
        #         # #     currencyCode
        #         # # }
        #         # # averageOrderAmountV2 {
        #         # #     amount
        #         # #     currencyCode
        #         # # }
        #         createdAt
        #         updatedAt
        #         # # note
        #         verifiedEmail
        #         validEmailAddress
        #         # tags
        #         lifetimeDuration
        #         defaultAddress {
        #             formattedArea
        #             address1
        #         }
        #         canDelete
        #     }
        # }

        # query {
        #     orders(first: 10) {
        #         edges {
        #             node {
        #                 id
        #                 displayFulfillmentStatus
        #                 fullyPaid
        #                 sourceIdentifier
        #                 # fulfillmentOrder {
        #                 #     createdAt
        #                 # }
        #                 # null
        #                 # registeredSourceUrl
        #             }
        #         }
        #     }
        # }

        # query {
        #     node(id: "gid://shopify/Checkout/36600421253410") {
        #         id
        #         ... on Checkout {
        #             webUrl
        #         }
        #     }
        # }
    `

    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )
    const client = new shopifyAdmin.clients.Graphql({ session })

    const test = await storefrontClient.query({
        data: {
            query: QUERY,
            // variables: PRODUCT_INPUT,
        },
    })
    // console.log(test.body.data.customer.orders.edges[0].node)
    // console.log(
    //     test.body.data.customer.orders.edges[0].node.publication.products.edges
    // )
    // console.log(test.body.data.customer.events.edges[1].node)
    // console.log(test.body.data.orders.edges[0].node)

    console.log(test.body.data.node.order)
    console.log(`-------------------------------------------------------`)
    console.log(test.body.data.node.order.lineItems.edges[0].node)
    return test
}
