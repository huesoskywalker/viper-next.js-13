import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Chats } from "../../lib/vipers"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    const client = await clientPromise
    const db = await client.db("viperDb").collection<Chats>("chats")

    if (req.method === "POST") {
        try {
            const initChat = await db.findOneAndUpdate(
                {
                    $or: [
                        {
                            members: [body.viperId, body.id],
                        },
                        {
                            members: [body.id, body.viperId],
                        },
                    ],
                },
                {
                    $setOnInsert: { members: [body.viperId, body.id] },
                },
                { upsert: true }
            )

            const messenger = await db.findOneAndUpdate(
                {
                    $or: [
                        {
                            members: [body.viperId, body.id],
                        },
                        {
                            members: [body.id, body.viperId],
                        },
                    ],
                },
                {
                    $push: {
                        messages: {
                            sender: body.viperId,
                            message: body.message,
                            time: new Date(),
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
