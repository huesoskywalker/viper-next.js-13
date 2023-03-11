import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Chats } from "../../lib/vipers"
import { ObjectId } from "mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const viperId: string = body.viperId
    const id: string = body.id
    const message: string = body.message

    const client = await clientPromise
    const db = client.db("viperDb").collection<Chats>("chats")

    if (req.method === "POST") {
        try {
            const initChat = await db.findOneAndUpdate(
                {
                    $or: [
                        {
                            members: [new ObjectId(viperId), new ObjectId(id)],
                        },
                        {
                            members: [new ObjectId(id), new ObjectId(viperId)],
                        },
                    ],
                },
                {
                    $setOnInsert: {
                        members: [new ObjectId(viperId), new ObjectId(id)],
                    },
                },
                { upsert: true }
            )

            const messenger = await db.findOneAndUpdate(
                {
                    $or: [
                        {
                            members: [new ObjectId(viperId), new ObjectId(id)],
                        },
                        {
                            members: [new ObjectId(id), new ObjectId(viperId)],
                        },
                    ],
                },
                {
                    $push: {
                        messages: {
                            _id: new ObjectId(),
                            sender: new ObjectId(viperId),
                            message: message,
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            return res.status(200).json(messenger)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
