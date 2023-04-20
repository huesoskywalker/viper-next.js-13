import clientPromise from "@/lib/mongodb"
import { EventInterface } from "@/types/event"
import { Viper } from "@/types/viper"
import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const id: string = body.id
    const viperId: string = body.viperId

    const client = await clientPromise
    const db = client.db("viperDb")
    const viperCollection = db.collection<Viper>("users")
    const eventCollection = db.collection<EventInterface>("events")

    const isLiked = await eventCollection.findOne({
        _id: new ObjectId(id),
        "likes._id": new ObjectId(viperId),
    })

    if (!isLiked) {
        try {
            const like = await eventCollection.findOneAndUpdate(
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

            const viperLike = await viperCollection.findOneAndUpdate(
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
            const disLike = await eventCollection.findOneAndUpdate(
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
            const viperDisLike = await viperCollection.findOneAndUpdate(
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
