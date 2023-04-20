import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const blogOwner_id: string = body.blogOwner_id
    const _id: string = body._id
    const viper_id: string = body.viper_id
    const comment: string = body.comment
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    if (req.method === "POST") {
        try {
            const commentBlog = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(blogOwner_id),
                    "blog._id": new ObjectId(_id),
                },
                {
                    $push: {
                        "blog.$.comments": {
                            _id: new ObjectId(),
                            viper_id: new ObjectId(viper_id),
                            comment: comment,
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            const blogCommented = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(viper_id),
                },
                {
                    $push: {
                        blogCommented: {
                            _id: new ObjectId(_id),
                            blogOwner_id: new ObjectId(blogOwner_id),
                            viper_id: new ObjectId(viper_id),
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
