import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"
import { ObjectId } from "mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    // const blogId = body.blogId.replace(/[\W]+/g, "")

    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const isLiked = await db
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(body.bloggerId),
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
                    "blog._id": new ObjectId(body.blogId),
                },
            },
            {
                $unwind: "$blog.likes",
            },
            {
                $match: { "blog.likes": new ObjectId(body.viperId) },
            },
        ])
        .toArray()

    if (isLiked.length === 0) {
        try {
            const like = await db.findOneAndUpdate(
                {
                    "blog._id": new ObjectId(body.blogId),
                },
                {
                    $push: { "blog.$.likes": new ObjectId(body.viperId) },
                }
            )

            const viperLike = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.viperId),
                },
                {
                    $push: {
                        blogLikes: {
                            bloggerId: new ObjectId(body.bloggerId),
                            blogId: new ObjectId(body.blogId),
                            viperId: new ObjectId(body.viperId),
                            comment: "",
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
                    "blog._id": new ObjectId(body.blogId),
                },
                {
                    $pull: {
                        "blog.$.likes": new ObjectId(body.viperId),
                    },
                }
            )
            const viperDisLike = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.viperId),
                },
                {
                    $pull: {
                        blogLikes: {
                            bloggerId: new ObjectId(body.bloggerId),
                            blogId: new ObjectId(body.blogId),
                            viperId: new ObjectId(body.viperId),
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
