import { NextApiRequest, NextApiResponse } from "next"
import { CUSTOMER_CREATE } from "@/graphql/mutation/customerCreate"
import { storefrontClient } from "@/lib/storefrontApi"
import { RequestReturn } from "@shopify/shopify-api"
import { Customer } from "@shopify/shopify-api/rest/admin/2023-01/customer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const email: string = body.email
    const password: string = body.password
    const phone: string = body.phone
    const firstName: string = body.firstName
    const lastName: string = body.lastName
    try {
        const CUSTOMER_INPUT = {
            input: {
                email: email,
                password: password,
                phone: phone,
                firstName: firstName,
                lastName: lastName,
            },
        }

        const newCustomer: RequestReturn<Customer> = await storefrontClient.query({
            data: {
                query: CUSTOMER_CREATE,
                variables: CUSTOMER_INPUT,
            },
        })

        return res.status(200).json({
            newCustomerCreate: newCustomer.body.data.customerCreate,
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}
