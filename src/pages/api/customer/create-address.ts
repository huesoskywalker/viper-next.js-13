import { NextApiRequest, NextApiResponse } from "next"
import { CUSTOMER_ADDRESS_CREATE } from "@/graphql/mutation/customerAddressCreate"
import { storefrontClient } from "@/lib/storefrontApi"
import { CustomerAddress } from "@shopify/shopify-api/rest/admin/2023-01/customer_address"
import { RequestReturn } from "@shopify/shopify-api"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const accessToken: string = body.accessToken
    const lastName: string = body.lastName
    const firstName: string = body.firstName
    const phone: string = body.phone
    const address: string = body.address
    const province: string = body.province
    const country: string = body.country
    const zip: string = body.zip
    const city: string = body.city
    try {
        const CUSTOMER_ADDRESS_INPUT = {
            customerAccessToken: accessToken,
            address: {
                lastName: firstName,
                firstName: lastName,
                phone: phone,
                address1: address,
                province: province,
                country: country,
                zip: zip,
                city: city,
            },
        }

        const customerAddress: RequestReturn<CustomerAddress> = await storefrontClient.query({
            data: {
                query: CUSTOMER_ADDRESS_CREATE,
                variables: CUSTOMER_ADDRESS_INPUT,
            },
        })

        return res
            .status(200)
            .json({ newAddress: customerAddress.body.data.customerAddressCreate })
    } catch (error) {
        return res.status(400).json(error)
    }
}
