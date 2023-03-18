import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const id: string = body.id
    const commentId: string = body.commentId
    const viperId: string = body.viperId
    const comment: string = body.comment
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    if (req.method === "POST") {
        try {
            const commentBlog = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(id),
                    "blog._id": new ObjectId(commentId),
                },
                {
                    $push: {
                        "blog.$.comments": {
                            _id: new ObjectId(),
                            viperId: new ObjectId(viperId),
                            comment: comment,
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            const blogCommented = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $push: {
                        blogCommented: {
                            bloggerId: new ObjectId(id),
                            blogId: new ObjectId(commentId),
                            viperId: new ObjectId(viperId),
                            comment: comment,
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
