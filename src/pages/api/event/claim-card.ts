import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { EventInterface } from "@/types/event"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const viperId: string = body.viperId
    const eventId: string = body.eventId
    const client = await clientPromise
    const db = client.db("viperDb")
    if (req.method === "POST") {
        try {
            const giftCard = await db.collection<EventInterface>("events").findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
                },
                {
                    $push: {
                        participants: {
                            _id: new ObjectId(viperId),
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
