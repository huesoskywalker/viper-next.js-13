import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Chats } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const viperId: string = body.viper._id
    const contactId: string = body.contact._id
    const message: string = body.message
    const timestamp: number = body.timestamp

    const client = await clientPromise
    const db = client.db("viperDb").collection<Chats>("chats")

    if (req.method === "POST") {
        try {
            const initChat = await db.findOneAndUpdate(
                {
                    $or: [
                        {
                            members: [new ObjectId(viperId), new ObjectId(contactId)],
                        },
                        {
                            members: [new ObjectId(contactId), new ObjectId(viperId)],
                        },
                    ],
                },
                {
                    $setOnInsert: {
                        members: [new ObjectId(viperId), new ObjectId(contactId)],
                        messages: [],
                    },
                },
                { upsert: true }
            )
            // This, should return a new mongodb doc, initChat one.
            const messenger = await db.findOneAndUpdate(
                {
                    $or: [
                        {
                            members: [new ObjectId(viperId), new ObjectId(contactId)],
                        },
                        {
                            members: [new ObjectId(contactId), new ObjectId(viperId)],
                        },
                    ],
                },
                {
                    $push: {
                        messages: {
                            _id: new ObjectId(),
                            sender: new ObjectId(viperId),
                            message: message,
                            timestamp: timestamp,
                        },
                    },
                }
            )
            console.log(`----messenger from chat endpoint`)

            console.log(messenger)
            return res.status(200).json(messenger)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
