import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"
import { ObjectId } from "mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const bloggerId: string = body.bloggerId
    const blogId: string = body.blogId
    const viperId: string = body.viperId

    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const isLiked = await db
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(bloggerId),
                },
            },
            {
                $project: {
                    _id: 0,
                    blog: 1,
                },
            },
            {
                $unwind: "$blog",
            },
            {
                $match: {
                    "blog._id": new ObjectId(blogId),
                },
            },
            {
                $unwind: "$blog.likes",
            },
            {
                $match: { "blog.likes": new ObjectId(viperId) },
            },
        ])
        .toArray()

    if (isLiked.length === 0) {
        try {
            const like = await db.findOneAndUpdate(
                {
                    "blog._id": new ObjectId(blogId),
                },
                {
                    $push: { "blog.$.likes": new ObjectId(viperId) },
                }
            )

            const viperLike = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $push: {
                        blogLikes: {
                            bloggerId: new ObjectId(bloggerId),
                            blogId: new ObjectId(blogId),
                            viperId: new ObjectId(viperId),
                            timestamp: Date.now(),
                        },
                    },
                }
            )
            return res.status(200).json(like)
        } catch (error) {
            return res.status(400).json(error)
        }
    } else {
        try {
            const disLike = await db.findOneAndUpdate(
                {
                    "blog._id": new ObjectId(blogId),
                },
                {
                    $pull: {
                        "blog.$.likes": new ObjectId(viperId),
                    },
                }
            )
            const viperDisLike = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $pull: {
                        blogLikes: {
                            bloggerId: new ObjectId(bloggerId),
                            blogId: new ObjectId(blogId),
                            viperId: new ObjectId(viperId),
                        },
                    },
                }
            )

            return res.status(200).json(disLike)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
