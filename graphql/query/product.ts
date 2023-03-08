const gql = String.raw

const PRODUCT_GET = gql`
    query product($id: ID!) {
        product(id: $id) {
            title
            totalInventory
            priceRange {
                minVariantPrice {
                    amount
                    currencyCode
                }
                maxVariantPrice {
                    amount
                    currencyCode
                }
            }
            variants(first: 10) {
                edges {
                    node {
                        id
                        # title
                        displayName
                        createdAt
                        price
                        # compareAtPrice
                        inventoryQuantity
                        availableForSale
                        # weight
                        # weightUnit
                        # selectedOptions {
                        #     name
                        #     value
                        # }
                        # media(first: 10) {
                        #     edges {
                        #         node {
                        #             alt
                        #             mediaContentType
                        #             status
                        #             __typename
                        #             ... on MediaImage {
                        #                 id
                        #                 preview {
                        #                     image {
                        #                         originalSrc
                        #                     }
                        #                 }
                        #                 __typename
                        #             }
                        #         }
                        #     }
                        # }
                    }
                }
            }
        }
    }
`

export default PRODUCT_GET
