import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { ModifyResult, ObjectId } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const blogOwner_id: string = body.blogOwner_id
    const _id: string = body._id
    const viper_id: string = body.viper_id

    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const isLiked = await db
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(blogOwner_id),
                },
            },
            {
                $project: {
                    _id: 0,
                    blog: 1,
                },
            },
            {
                $unwind: "$blog.myBlog",
            },
            {
                $match: {
                    "blog.myBlog._id": new ObjectId(_id),
                },
            },
            {
                $unwind: "$blog.myBlog.likes",
            },
            {
                $match: { "blog.myBlog.likes": { _id: new ObjectId(viper_id) } },
            },
        ])
        .toArray()
    if (isLiked.length === 0) {
        try {
            const likeMyBlog = await db.findOneAndUpdate(
                {
                    "blog.myBlog._id": new ObjectId(_id),
                },
                {
                    $push: { "blog.myBlog.$.likes": { _id: new ObjectId(viper_id) } },
                }
            )

            const addBlogLike = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(viper_id),
                },
                {
                    $push: {
                        "blog.likes": {
                            blogOwner_id: new ObjectId(blogOwner_id),
                            _id: new ObjectId(_id),
                            viper_id: new ObjectId(viper_id),
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            return res.status(200).json([likeMyBlog, addBlogLike])
        } catch (error) {
            return res.status(400)
        }
    } else {
        try {
            const disLikeMyBlog = await db.findOneAndUpdate(
                {
                    "blog.myBlog._id": new ObjectId(_id),
                },
                {
                    $pull: {
                        "blog.myBlog.$.likes": { _id: new ObjectId(viper_id) },
                    },
                }
            )
            const removeBlogLike = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(viper_id),
                },
                {
                    $pull: {
                        "blog.likes": {
                            blogOwner_id: new ObjectId(blogOwner_id),
                            _id: new ObjectId(_id),
                            viper_id: new ObjectId(viper_id),
                        },
                    },
                }
            )

            return res.status(200).json([disLikeMyBlog, removeBlogLike])
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
