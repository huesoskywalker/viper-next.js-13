import { NextApiRequest, NextApiResponse } from "next"
import { CUSTOMER_CREATE } from "../../graphql/mutation/customerCreate"
import { storefrontClient } from "../../lib/storefrontApi"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    try {
        const CUSTOMER_INPUT = {
            input: {
                email: body.email,
                password: body.password,
                phone: body.phone,
                firstName: body.firstName,
                lastName: body.lastName,
                // emailMarketingConsent: body.emailMarketingConsent,
            },
        }

        const customer = await storefrontClient.query({
            data: {
                query: CUSTOMER_CREATE,
                variables: CUSTOMER_INPUT,
            },
        })

        return res.status(200).json(customer)
    } catch (error) {
        return res.status(400).json(error)
    }
}
