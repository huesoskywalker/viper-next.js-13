import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const viperId: string = body.viperId
    const phone: string = body.phone
    const address: string = body.address
    const city: string = body.city
    const province: string = body.province
    const zip: string = body.zip
    const country: string = body.country
    const accessToken: string = body.accessToken
    const newCustomerId: string = body.newCustomerId

    const client = await clientPromise
    const db = client.db("viperDb")

    if (req.method === "PUT") {
        try {
            const updateViper = await db.collection<Viper>("users").findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $set: {
                        address: {
                            phone: Number(phone),
                            address: address,
                            city: city,
                            province: province,
                            zip: Number(zip),
                            country: country,
                        },
                        shopify: {
                            customerAccessToken: accessToken,
                            customerId: newCustomerId,
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
