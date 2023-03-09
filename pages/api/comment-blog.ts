import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"
import { ObjectId } from "mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    if (req.method === "POST") {
        try {
            const commentBlog = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.id),
                    "blog._id": new ObjectId(body.commentId),
                },
                {
                    $push: {
                        "blog.$.comments": {
                            _id: new ObjectId(),
                            viperId: new ObjectId(body.viperId),
                            comment: body.comment,
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            const blogCommented = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.viperId),
                },
                {
                    $push: {
                        blogCommented: {
                            bloggerId: new ObjectId(body.id),
                            blogId: new ObjectId(body.commentId),
                            viperId: new ObjectId(body.viperId),
                            comment: body.comment,
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            console.log(blogCommented)
            return res.status(200).json(commentBlog)
        } catch (error) {
            console.error(error)
        }
    }
}
