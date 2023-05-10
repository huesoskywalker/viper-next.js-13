import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const currentViperId: string = body.currentViper._id
    const viperId: string = body.viper._id

    const client = await clientPromise
    const db = client.db("viperDb")

    if (req.method === "PUT") {
        const follower = await db.collection<Viper>("users").findOne({
            _id: new ObjectId(viperId),
            "followers._id": new ObjectId(currentViperId),
        })

        if (!follower) {
            const newFollow = await db.collection<Viper>("users").findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $push: {
                        followers: { _id: new ObjectId(currentViperId) },
                    },
                }
            )

            const myFollows = await db.collection<Viper>("users").findOneAndUpdate(
                {
                    _id: new ObjectId(currentViperId),
                },
                {
                    $push: {
                        follows: { _id: new ObjectId(viperId) },
                    },
                }
            )
            return res.status(200).json([newFollow, myFollows])
        } else {
            const unFollow = await db.collection<Viper>("users").findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $pull: {
                        followers: { _id: new ObjectId(currentViperId) },
                    },
                }
            )
            const myNoFollows = await db.collection<Viper>("users").findOneAndUpdate(
                {
                    _id: new ObjectId(currentViperId),
                },
                {
                    $pull: {
                        follows: { _id: new ObjectId(viperId) },
                    },
                }
            )
            return res.status(200).json(unFollow)
        }
    }
}
