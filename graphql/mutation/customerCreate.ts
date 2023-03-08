const gql = String.raw
export const CUSTOMER_CREATE = gql`
    mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            userErrors {
                field
                message
            }
            customer {
                id
                # email
                # password
                # phone

                # taxExempt

                # acceptsMarketing
                # firstName
                # lastName

                # ordersCount
                # totalSpent
                # smsMarketingConsent {
                #     marketingState
                #     marketingOptInLevel
                # }

                # addresses {
                #     address1
                #     city
                #     country
                #     phone
                #     zip
                # }
            }
        }
    }
`
