import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { EventInterface } from "../../lib/events"
import clientPromise from "../../lib/mongodb"
import type { Viper } from "../../lib/vipers"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PUT") {
        const body = req.body
        const checkoutId = body.checkoutId
        try {
            const client = await clientPromise
            const db = client.db("viperDb")

            const finder = await db.collection<Viper>("users").findOne({
                _id: new ObjectId(body.viper),
                "participated._id": new ObjectId(body.eventId),
            })

            if (!finder && !checkoutId) {
                const viper = await db
                    .collection<Viper>("users")
                    .findOneAndUpdate(
                        {
                            _id: new ObjectId(body.viper),
                        },
                        {
                            $push: {
                                participated: {
                                    _id: new ObjectId(body.eventId),
                                    checkoutId: checkoutId,
                                },
                            },
                        }
                    )
                const tracker = await db
                    .collection<EventInterface>("organized_events")
                    .findOneAndUpdate(
                        {
                            _id: new ObjectId(body.eventId),
                        },
                        {
                            $push: {
                                participants: {
                                    _id: new ObjectId(body.eventId),
                                },
                            },
                        },
                        { upsert: true }
                    )

                return res.status(200).json(viper)
            } else {
                const noViper = await db
                    .collection<Viper>("users")
                    .findOneAndUpdate(
                        {
                            _id: new ObjectId(body.viper),
                        },
                        {
                            $pull: {
                                participated: {
                                    _id: new ObjectId(body.eventId),
                                },
                            },
                        }
                    )

                const noTracker = await db
                    .collection<EventInterface>("organized_events")
                    .findOneAndUpdate(
                        {
                            _id: new ObjectId(body.eventId),
                        },
                        {
                            $pull: {
                                participants: {
                                    _id: new ObjectId(body.eventId),
                                },
                            },
                        }
                    )

                return res.status(200).json(noViper)
            }
        } catch (error) {
            return console.error(400)
        }
    }
}
