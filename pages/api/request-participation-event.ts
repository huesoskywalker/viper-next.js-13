import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import type { Viper } from "../../lib/vipers"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PUT") {
        const body = req.body
        const checkoutId = body.checkoutId
        const client = await clientPromise
        const db = client.db("viperDb")

        const request = await db.collection<Viper>("users").findOneAndUpdate(
            {
                _id: new ObjectId(body.viper),
            },
            {
                $push: {
                    collection: {
                        _id: new ObjectId(body.eventId),
                        checkoutId: checkoutId,
                    },
                },
            },
            { upsert: true }
        )
        return res.status(200).json(request)
    }
}
