import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"
import { ObjectId } from "mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const client = await clientPromise
    const db = client.db("viperDb")

    if (req.method === "PUT") {
        try {
            const updateViper = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.viperId),
                    },
                    {
                        $set: {
                            address: {
                                phone: body.phone,
                                address: body.address,
                                city: body.city,
                                province: body.province,
                                zip: body.zip,
                                country: body.country,
                            },
                            shopify: {
                                customerAccessToken: body.accessToken,
                                customerId: body.newCustomerId,
                            },
                        },
                    },
                    { upsert: true }
                )
            console.log(updateViper)
            return res.status(200).json(updateViper)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
