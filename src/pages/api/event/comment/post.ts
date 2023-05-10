import clientPromise from "@/lib/mongodb"
import { EventInterface } from "@/types/event"
import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const viperId: string = body.viper._id

    const client = await clientPromise
    const db = client.db("viperDb").collection<EventInterface>("events")
    if (body.comment !== "") {
        const newComment = await db.findOneAndUpdate(
            {
                _id: new ObjectId(eventId),
            },

            {
                $push: {
                    comments: {
                        _id: new ObjectId(),
                        viperId: new ObjectId(viperId),
                        text: body.comment,
                        likes: [],
                        replies: [],
                        timestamp: Date.now(),
                    },
                },
            }
        )
        return res.status(200).json(newComment)
    }
    return res.status(400)
}
