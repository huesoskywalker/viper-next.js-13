import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { Viper } from "@/types/viper"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    const client = await clientPromise
    const db = client.db("viperDb")

    if (req.method === "PUT") {
        const follower = await db.collection<Viper>("users").findOne({
            _id: new ObjectId(body.id),
            "followers._id": new ObjectId(body.viperId),
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
                            followers: { _id: new ObjectId(body.viperId) },
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
                            follows: { _id: new ObjectId(body.id) },
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
                            followers: { _id: new ObjectId(body.viperId) },
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
                            follows: { _id: new ObjectId(body.id) },
                        },
                    }
                )
            return res.status(200).json(unFollow)
        }
    }
}
