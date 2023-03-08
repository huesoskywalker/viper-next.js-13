const customerByAccessToken = () => {
    // {
    //     customerAccessToken: { accessToken: 'dd4018da2321a4329de8beba836163ba' },
    //     customerUserErrors: []
    //   }
    const gql = String.raw
    return gql`
        # mutation customerAccessTokenCreate(
        #     $input: CustomerAccessTokenCreateInput!
        # ) {
        #     customerAccessTokenCreate(input: $input) {
        #         customerAccessToken {
        #             accessToken
        #         }
        #         customerUserErrors {
        #             message
        #         https://shopify.dev/docs/api/admin-graphql/2022-10/mutations/customerCreate#examples-Create_a_customer}
        #     }
        # }

        {
            customer(customerAccessToken: "dd4018da2321a4329de8beba836163ba") {
                id
                firstName
                lastName
                acceptsMarketing
                email
                phone
                numberOfOrders
                orders(first: 10) {
                    edges {
                        node {
                            id
                            orderNumber
                            currencyCode
                            totalPriceV2 {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
            }
        }
    `
}

export default customerByAccessToken
