import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    const client = await clientPromise
    const db = client.db("viperDb")

    const isLiked = await db.collection("organized_events").findOne({
        _id: new ObjectId(body.id),
        likes: body.viperId,
    })

    if (!isLiked) {
        try {
            const like = await db
                .collection("organized_events")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.id),
                    },
                    {
                        $push: {
                            likes: body.viperId,
                        },
                    }
                )
            return res.status(200).json(like)
        } catch (error) {
            return res.status(400).json(error)
        }
    } else {
        try {
            const dislike = await db
                .collection("organized_events")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.id),
                    },
                    {
                        $pull: {
                            likes: body.viperId,
                        },
                    }
                )
            return res.status(200).json(dislike)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
