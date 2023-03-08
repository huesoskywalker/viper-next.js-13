import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { EventInterface } from "../../lib/events"
import clientPromise from "../../lib/mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const client = await clientPromise
    const db = client.db("viperDb")
    if (req.method === "POST") {
        try {
            const giftCard = await db
                .collection<EventInterface>("organized_events")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.eventId),
                    },
                    {
                        $push: {
                            participants: {
                                _id: new ObjectId(body.viperId),
                            },
                        },
                    },
                    { upsert: true }
                )
            return res.status(200).json(giftCard)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
