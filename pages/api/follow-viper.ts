import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    const client = await clientPromise
    const db = await client.db("viperDb")

    if (req.method === "PUT") {
        const follower = await db.collection<Viper>("users").findOne({
            _id: new ObjectId(body.id),
            followers: new ObjectId(body.viperId),
        })

        if (!follower) {
            const newFollow = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.id),
                    },
                    {
                        $push: {
                            followers: new ObjectId(body.viperId),
                        },
                    }
                )

            const myFollows = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.viperId),
                    },
                    {
                        $push: {
                            follows: new ObjectId(body.id),
                        },
                    }
                )
            return res.status(200).json(newFollow)
        } else {
            const unFollow = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.id),
                    },
                    {
                        $pull: {
                            followers: new ObjectId(body.viperId),
                        },
                    }
                )
            const myNoFollows = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.viperId),
                    },
                    {
                        $pull: {
                            follows: new ObjectId(body.id),
                        },
                    }
                )
            return res.status(200).json(unFollow)
        }
    }
}
