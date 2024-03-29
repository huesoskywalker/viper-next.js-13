import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { EventInterface } from "@/types/event"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const commentId: string = body.comment._id
    const viperId: string = body.viper._id

    const client = await clientPromise
    const db = client.db("viperDb").collection<EventInterface>("events")
    if (req.method === "POST") {
        const isLiked = await db
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(eventId),
                    },
                },
                {
                    $unwind: "$comments",
                },
                {
                    $match: {
                        "comments._id": new ObjectId(commentId),
                    },
                },
                {
                    $unwind: "$comments.likes",
                },
                {
                    $match: { "comments.likes": new ObjectId(viperId) },
                },
                {
                    $project: { _id: 0, "comments.likes": 1 },
                },
            ])
            .toArray()
        if (isLiked.length === 0) {
            try {
                const likeComment = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(eventId),
                        comments: {
                            $elemMatch: {
                                _id: new ObjectId(commentId),
                            },
                        },
                    },
                    {
                        $push: {
                            "comments.$.likes": new ObjectId(viperId),
                        },
                    }
                )
                return res.status(200).json(likeComment)
            } catch (error) {
                return res.status(400).json(error)
            }
        } else {
            try {
                const disLikeComment = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(eventId),
                        comments: {
                            $elemMatch: {
                                _id: new ObjectId(commentId),
                            },
                        },
                    },
                    {
                        $pull: {
                            "comments.$.likes": new ObjectId(viperId),
                        },
                    }
                )
                return res.status(200).json(disLikeComment)
            } catch (error) {
                return res.status(400).json(error)
            }
        }
    }
}
