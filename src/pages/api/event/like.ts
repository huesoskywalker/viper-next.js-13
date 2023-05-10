import clientPromise from "@/lib/mongodb"
import { EventInterface } from "@/types/event"
import { Viper } from "@/types/viper"
import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const eventId: string = body.event._id
    const viperId: string = body.viper._id

    const client = await clientPromise
    const db = client.db("viperDb")
    const viperCollection = db.collection<Viper>("users")
    const eventCollection = db.collection<EventInterface>("events")

    const isLiked = await eventCollection.findOne({
        _id: new ObjectId(eventId),
        "likes._id": new ObjectId(viperId),
    })

    if (!isLiked) {
        try {
            const likeEvent = await eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
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
                        "myEvents.likes": {
                            _id: new ObjectId(eventId),
                        },
                    },
                }
            )
            return res.status(200).json([likeEvent, viperLike])
        } catch (error) {
            return res.status(400).json(error)
        }
    } else {
        try {
            const disLikeEvent = await eventCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(eventId),
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
                        "myEvents.likes": {
                            _id: new ObjectId(eventId),
                        },
                    },
                }
            )
            return res.status(200).json(disLikeEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
