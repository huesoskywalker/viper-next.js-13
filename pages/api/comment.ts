import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { getCurrentViper } from "../../lib/session"
import { EventInterface } from "../../lib/events"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // async function run() {
    const body = req.body

    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    if (body.comment !== "") {
        const response = await db.findOneAndUpdate(
            {
                _id: new ObjectId(body.id),
            },

            {
                $push: {
                    comments: {
                        _id: new ObjectId(),
                        viperId: new ObjectId(body.viperId),
                        text: body.comment,
                        likes: [],
                        replies: [],
                    },
                },
            }
        )
        res.status(200).json(response)
    }
    res.status(400)
}
// run().catch(console.dir)
// }
