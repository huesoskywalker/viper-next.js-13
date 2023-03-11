import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { Viper } from "../../lib/vipers"
import { EventInterface } from "../../lib/events"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const id: string = body.id
    const viperId: string = body.viperId

    const client = await clientPromise
    const db = client.db("viperDb")

    const isLiked = await db
        .collection<EventInterface>("organized_events")
        .findOne({
            _id: new ObjectId(id),
            "likes._id": new ObjectId(viperId),
        })

    if (!isLiked) {
        try {
            const like = await db
                .collection<EventInterface>("organized_events")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(id),
                    },
                    {
                        $push: {
                            likes: {
                                _id: new ObjectId(viperId),
                            },
                        },
                    }
                )

            const viperLike = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                    },
                    {
                        $push: {
                            likes: {
                                _id: new ObjectId(id),
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
            const disLike = await db
                .collection<EventInterface>("organized_events")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(id),
                    },
                    {
                        $pull: {
                            likes: {
                                _id: new ObjectId(viperId),
                            },
                        },
                    }
                )
            const viperDisLike = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                    },
                    {
                        $pull: {
                            likes: {
                                _id: new ObjectId(id),
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
