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
        const reply_id = body.replyId.replace(/["']+/g, "")
        const isLiked = await db
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(body.eventId),
                    },
                },
                {
                    $unwind: "$comments",
                },
                {
                    $match: {
                        "comments._id": new ObjectId(body.commentId),
                    },
                },
                {
                    $unwind: "$comments.replies",
                },
                {
                    $match: {
                        "comments.replies._id": new ObjectId(reply_id),
                        "comments.replies.likes": new ObjectId(body.viperId),
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

        // .findOne({
        //     _id: new ObjectId(body.eventId),
        //     comments: {
        //         $elemMatch: {
        //             _id: new ObjectId(body.commentId),
        //             "replies._id": new ObjectId(reply_id),
        //             "replies.likes": new ObjectId(body.viperId),
        //         },
        //     },
        // })

        if (isLiked.length === 0) {
            console.log(body.eventId)
            console.log(body.commentId)
            console.log(reply_id)
            try {
                const likeReply = await db.findOneAndUpdate(
                    {
                        _id: new ObjectId(body.eventId),
                        "comments._id": new ObjectId(body.commentId),
                        "comments.replies._id": new ObjectId(reply_id),
                    },
                    {
                        $push: {
                            "comments.$[i].replies.$[j].likes": new ObjectId(
                                body.viperId
                            ),
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "i._id": new ObjectId(body.commentId),
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
                        _id: new ObjectId(body.eventId),
                        "comments._id": new ObjectId(body.commentId),
                        "comments.replies._id": new ObjectId(reply_id),
                    },
                    {
                        $pull: {
                            "comments.$[i].replies.$[j].likes": new ObjectId(
                                body.viperId
                            ),
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "i._id": new ObjectId(body.commentId),
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
