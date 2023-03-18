const gql = String.raw

export const PRODUCT_CREATE = gql`
    mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                id
            }
            shop {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
`
