import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { EventInterface } from "../../types/event"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const eventId: string = body.eventId
    const commentId: string = body.commentId
    const viperId: string = body.viperId
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    if (req.method === "POST") {
        const reply_id: string = body.replyId.replace(/["']+/g, "")
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
                    $unwind: "$comments.replies",
                },
                {
                    $match: {
                        "comments.replies._id": new ObjectId(reply_id),
                        "comments.replies.likes": new ObjectId(viperId),
                    },
                },
                {
                    $project: {
                        _id: 0,
                        "comments.replies": 1,
                    },
                },
            ])
            .toArray()

        if (isLiked.length === 0) {
            try {
                const likeReply = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(eventId),
                        "comments._id": new ObjectId(commentId),
                        "comments.replies._id": new ObjectId(reply_id),
                    },
                    {
                        $push: {
                            "comments.$[i].replies.$[j].likes": new ObjectId(
                                viperId
                            ),
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "i._id": new ObjectId(commentId),
                            },
                            {
                                "j._id": new ObjectId(reply_id),
                            },
                        ],
                    }
                )
                console.log(likeReply)
                return res.status(200).json(likeReply)
            } catch (error) {
                return res.status(400).json(error)
            }
        } else {
            try {
                const disLikeReply = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(eventId),
                        "comments._id": new ObjectId(commentId),
                        "comments.replies._id": new ObjectId(reply_id),
                    },
                    {
                        $pull: {
                            "comments.$[i].replies.$[j].likes": new ObjectId(
                                viperId
                            ),
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "i._id": new ObjectId(commentId),
                            },
                            {
                                "j._id": new ObjectId(reply_id),
                            },
                        ],
                    }
                )
                return res.status(200).json(disLikeReply)
            } catch (error) {
                return res.status(400).json(error)
            }
        }
    }
}
