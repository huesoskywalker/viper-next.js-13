const checkoutCreate = () => {
    const gql = String.raw
    return gql`
        mutation checkoutCreate($variantId: ID!) {
            checkoutCreate(
                input: { lineItems: [{ variantId: $variantId, quantity: 1 }] }
            ) {
                checkoutUserErrors {
                    field
                    message
                }
                checkout {
                    id
                    webUrl
                    subtotalPriceV2 {
                        amount
                        currencyCode
                    }
                    totalTaxV2 {
                        amount
                        currencyCode
                    }
                    totalPriceV2 {
                        amount
                        currencyCode
                    }
                    completedAt
                    createdAt
                    taxesIncluded
                    lineItems(first: 1) {
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                        }
                        edges {
                            node {
                                id
                                title
                                variant {
                                    id
                                    sku
                                    title
                                    image {
                                        originalSrc
                                        altText
                                        width
                                        height
                                    }
                                    priceV2 {
                                        amount
                                        currencyCode
                                    }
                                    compareAtPriceV2 {
                                        amount
                                        currencyCode
                                    }
                                    product {
                                        handle
                                    }
                                }
                                quantity
                            }
                        }
                    }
                }
            }
        }
    `

    //----------------------------------
    // query: gql`
    //     mutation {
    //         checkoutCreate(
    //             input: {
    //                 customAttributes: [
    //                     {
    //                         key: "id"
    //                         value: "gid://shopify/Product/8124267888930"
    //                     }
    //                     { key: "title", value: "viper Card" }
    //                 ]
    //             }
    //         ) {
    // checkout {
    //     id
    //     webUrl
    //     subtotalPriceV2 {
    //         amount
    //         currencyCode
    //     }
    //     totalTaxV2 {
    //         amount
    //         currencyCode
    //     }
    //     totalPriceV2 {
    //         amount
    //         currencyCode
    //     }
    //     completedAt
    //     createdAt
    //     taxesIncluded
    //     lineItems(first: 250) {
    //         pageInfo {
    //             hasNextPage
    //             hasPreviousPage
    //         }
    //         edges {
    //             node {
    //                 id
    //                 title
    //                 variant {
    //                     id
    //                     sku
    //                     title
    //                     image {
    //                         originalSrc
    //                         altText
    //                         width
    //                         height
    //                     }
    //                     priceV2 {
    //                         amount
    //                         currencyCode
    //                     }
    //                     compareAtPriceV2 {
    //                         amount
    //                         currencyCode
    //                     }
    //                     product {
    //                         handle
    //                     }
    //                 }
    //                 quantity
    //             }
    //         }
    //     }
    // }
    //         }
    //     }
    // `,
    //----------------------------------
}

export default checkoutCreate
