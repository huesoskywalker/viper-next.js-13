import errors from "formidable/FormidableError"
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
        const isLiked = await db.findOne({
            _id: new ObjectId(body.eventId),
            "comments._id": new ObjectId(body.commentId),
            "comments.replies._id": new ObjectId(body.replyId),
            "comments.replies.likes": body.viperId,
        })

        if (!isLiked) {
            try {
                const likeReply = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(body.eventId),
                        "comments._id": new ObjectId(body.commentId),
                        "comments.replies._id": new ObjectId(body.replyId),
                    },
                    {
                        $push: {
                            "comments.$[i].replies.$[j].likes": body.viperId,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "i._id": new ObjectId(body.commentId),
                            },
                            {
                                "j._id": new ObjectId(body.replyId),
                            },
                        ],
                    }
                )
                return res.status(200).json(likeReply)
            } catch (error) {
                return res.status(400).json(error)
            }
        } else {
            try {
                const disLikeReply = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(body.eventId),
                        "comments._id": new ObjectId(body.commentId),
                        "comments.replies._id": new ObjectId(body.replyId),
                    },
                    {
                        $pull: {
                            "comments.$[i].replies.$[j].likes": body.viperId,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "i._id": new ObjectId(body.commentId),
                            },
                            {
                                "j._id": new ObjectId(body.replyId),
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
