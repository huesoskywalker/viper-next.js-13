const gql = String.raw

export const PRODUCT_PUBLISH = gql`
    mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
            publishable {
                availablePublicationCount
                publicationCount
            }
            shop {
                publicationCount
            }
            userErrors {
                field
                message
            }
        }
    }
`
