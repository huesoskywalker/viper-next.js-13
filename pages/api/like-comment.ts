import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { EventInterface } from "../../lib/events"
import clientPromise from "../../lib/mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    if (req.method === "POST") {
        const isLiked = await db
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(body.id),
                    },
                },
                {
                    $project: { _id: 0, "comments.likes": 1 },
                },
                {
                    $unwind: "$comments",
                },
                {
                    $unwind: "$comments.likes",
                },
                {
                    $match: { "comments.likes": body.viperId },
                },
            ])
            .toArray()

        if (isLiked.length === 0) {
            try {
                const likeComment = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(body.id),
                        comments: {
                            $elemMatch: {
                                _id: new ObjectId(body.commentId),
                                text: body.comment,
                            },
                        },
                    },
                    {
                        $push: {
                            "comments.$.likes": body.viperId,
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
                        _id: new ObjectId(body.id),
                        comments: {
                            $elemMatch: {
                                _id: new ObjectId(body.commentId),
                                text: body.comment,
                            },
                        },
                    },
                    {
                        $pull: {
                            "comments.$.likes": body.viperId,
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
