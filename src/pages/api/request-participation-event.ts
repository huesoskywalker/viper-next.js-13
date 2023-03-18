import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { Viper } from "@/types/viper"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const viperId: string = body.viperId
    const eventId: string = body.eventId
    const checkoutId: string = body.checkoutId
    if (req.method === "PUT") {
        try {
            const client = await clientPromise
            const db = client.db("viperDb")

            const request = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                    },
                    {
                        $push: {
                            collection: {
                                _id: new ObjectId(eventId),
                                checkoutId: checkoutId,
                            },
                        },
                    },
                    { upsert: true }
                )
            return res.status(200).json(request)
        } catch (error: any) {
            return res.status(400).json(error)
        }
    }
}
