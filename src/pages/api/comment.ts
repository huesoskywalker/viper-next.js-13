import clientPromise from "@/lib/mongodb"
import { EventInterface } from "@/types/event"
import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const id: string = body.id
    const viperId: string = body.viperId

    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    if (body.comment !== "") {
        const response = await db.findOneAndUpdate(
            {
                _id: new ObjectId(id),
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
        return res.status(200).json(response)
    }
    return res.status(400)
}
