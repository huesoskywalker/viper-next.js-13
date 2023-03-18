import { NextApiRequest, NextApiResponse } from "next"
import { storefrontClient } from "@/lib/storefrontApi"
import { CHECKOUT_CUSTOMER_ASSOCIATE } from "@/graphql/mutation/checkoutCustomerAssociateV2"
import { Checkout } from "@shopify/shopify-api/rest/admin/2023-01/checkout"
import { RequestReturn } from "@shopify/shopify-api"
import { Customer } from "@shopify/shopify-api/rest/admin/2023-01/customer"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    if (req.method === "POST") {
        try {
            const CHECKOUT_CUSTOMER_INPUT = {
                checkoutId: body.checkoutId,
                customerAccessToken: body.customerAccessToken,
            }

            const association: RequestReturn<Checkout & Customer> =
                await storefrontClient.query({
                    data: {
                        query: CHECKOUT_CUSTOMER_ASSOCIATE,
                        variables: CHECKOUT_CUSTOMER_INPUT,
                    },
                })
            return res.status(200).json(association)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
