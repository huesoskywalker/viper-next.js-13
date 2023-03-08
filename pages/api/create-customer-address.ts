import { NextApiRequest, NextApiResponse } from "next"
import { CUSTOMER_ADDRESS_CREATE } from "../../graphql/mutation/customerAddressCreate"
import { storefrontClient } from "../../lib/storefrontApi"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    try {
        const CUSTOMER_ADDRESS_INPUT = {
            customerAccessToken: body.accessToken,
            address: {
                lastName: body.firstName,
                firstName: body.lastName,
                phone: body.phone,
                address1: body.address,
                province: body.province,
                country: body.country,
                zip: body.zip,
                city: body.city,
            },
        }

        const customerAddress = await storefrontClient.query({
            data: {
                query: CUSTOMER_ADDRESS_CREATE,
                variables: CUSTOMER_ADDRESS_INPUT,
            },
        })

        return res.status(200).json(customerAddress)
    } catch (error) {
        return res.status(400).json(error)
    }
}
