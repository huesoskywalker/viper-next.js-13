const gql = String.raw

export const CHECKOUT_CREATE = gql`
    mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkoutUserErrors {
                code
                field
                message
            }
            checkout {
                id
                webUrl
                id
                webUrl
                orderStatusUrl

                # shippingAddress {
                #     firstName
                #     lastName
                #     address1
                #     province
                #     country
                #     zip
                # }
                # email

                # subtotalPrice {
                #     amount
                #     currencyCode
                # }
                # totalTax {
                #     amount
                #     currencyCode
                # }
                # totalPrice {
                #     amount
                #     currencyCode
                # }
                # completedAt
                # createdAt
                # taxesIncluded
                lineItems(first: 1) {
                    # pageInfo {
                    #     hasNextPage
                    #     hasPreviousPage
                    # }
                    edges {
                        node {
                            id
                            title
                            variant {
                                id
                                sku
                                title
                                # image {
                                #     originalSrc
                                #     altText
                                #     width
                                #     height
                                # }
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                                # compareAtPriceV2 {
                                #     amount
                                #     currencyCode
                                # }
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
