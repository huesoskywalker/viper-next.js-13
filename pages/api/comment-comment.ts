import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { EventInterface } from "../../lib/events"
import clientPromise from "../../lib/mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const comment_id = body.commentId.replace(/[\W]+/g, "")
    console.log(comment_id)
    console.log(`----comment-comment--------`)
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    if (req.method === "POST") {
        try {
            const commentTheComment = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.id),
                    "comments._id": new ObjectId(comment_id),
                },
                {
                    $push: {
                        "comments.$.replies": {
                            _id: new ObjectId(),
                            viperId: new ObjectId(body.viperId),
                            reply: body.comment,
                            likes: [],
                        },
                    },
                }
            )
            console.log(commentTheComment)
            return res.status(200).json(commentTheComment)
        } catch (error) {
            return res.status(400).json(error)
        }

        // .aggregate([
        //     {
        //         $match: { _id: new ObjectId(body.id) },
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             comments: 1,
        //         },
        //     },
        //     {
        //         $unwind: "$comments",
        //     },
        //     {
        //         $unwind: "$comments.comments"
        //     }

        // ])
        // .toArray()
    }
}
