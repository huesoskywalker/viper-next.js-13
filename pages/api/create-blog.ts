import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    if (req.method === "POST") {
        try {
            const blogContent = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.viperId),
                },
                {
                    $push: {
                        blog: {
                            _id: new ObjectId(),
                            content: body.comment,
                            likes: [],
                            comments: [],
                            rePosts: [],
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            return res.status(200).json(blogContent)
        } catch (error) {
            return res.status(400)
        }
    }
}
