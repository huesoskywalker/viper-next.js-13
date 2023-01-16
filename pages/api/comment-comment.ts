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
        try {
            const commentTheComment = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.id),
                    "comments.viperId": body.viperIdComment,
                    "comments.text": body.viperComment,
                    // comments: {
                    //     $elemMatch: {
                    //         viperId: body.viperIdComment,
                    //         text: body.viperComment,
                    //     },
                    // },
                },
                {
                    $push: {
                        "comments.$.replies": {
                            viperId: body.viperId,
                            reply: body.comment,
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