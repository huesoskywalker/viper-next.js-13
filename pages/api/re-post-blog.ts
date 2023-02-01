import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"
import { ObjectId } from "mongodb"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const body = req.body

    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const isRePosted = await db
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(body.viperId),
                },
            },
            {
                $unwind: "$blogRePosts",
            },
            {
                $project: {
                    _id: 0,
                    blogRePosts: 1,
                },
            },
            {
                $match: {
                    "blogRePosts.bloggerId": new ObjectId(body.bloggerId),
                    "blogRePosts.blogId": new ObjectId(body.blogId),
                    "blogRePosts.viperId": new ObjectId(body.viperId),
                },
            },
        ])
        .toArray()

    if (isRePosted.length === 0) {
        try {
            const viperBlog = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.viperId),
                },
                {
                    $push: {
                        blogRePosts: {
                            bloggerId: new ObjectId(body.bloggerId),
                            blogId: new ObjectId(body.blogId),
                            viperId: new ObjectId(body.viperId),
                            timestamp: Date.now(),
                        },
                    },
                }
            )

            const blogRePost = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.bloggerId),
                    blog: {
                        $elemMatch: {
                            _id: new ObjectId(body.blogId),
                        },
                    },
                },
                {
                    $push: {
                        "blog.$.rePosts": body.viperId,
                    },
                }
            )

            return res.status(200).json(viperBlog)
        } catch (error) {
            return res.status(400).json(error)
        }
    } else {
        try {
            const viperBlog = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.viperId),
                },
                {
                    $pull: {
                        blogRePosts: {
                            bloggerId: new ObjectId(body.bloggerId),
                            blogId: new ObjectId(body.blogId),
                            viperId: new ObjectId(body.viperId),
                        },
                    },
                }
            )
            const blogUndoRePost = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body.bloggerId),
                    blog: {
                        $elemMatch: {
                            _id: new ObjectId(body.blogId),
                        },
                    },
                },
                {
                    $pull: {
                        "blog.$.rePosts": body.viperId,
                    },
                }
            )
            return res.status(200).json(viperBlog)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
