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
        try {
            const client = await clientPromise
            const db = await client.db("viperDb")

            const finder = await db.collection<Viper>("users").findOne({
                _id: new ObjectId(body.viper),
                "participated._id": new ObjectId(body.id),
            })

            if (!finder) {
                const viper = await db
                    .collection<Viper>("users")
                    .findOneAndUpdate(
                        {
                            _id: new ObjectId(body.viper),
                        },
                        {
                            $push: {
                                participated: {
                                    _id: new ObjectId(body.id),
                                },
                            },
                        }
                    )
                const tracker = await db
                    .collection<EventInterface>("organized_events")
                    .findOneAndUpdate(
                        {
                            _id: new ObjectId(body.id),
                        },
                        {
                            $push: {
                                participants: {
                                    _id: new ObjectId(body.id),
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
                                    _id: new ObjectId(body.id),
                                },
                            },
                        }
                    )

                const noTracker = await db
                    .collection<EventInterface>("organized_events")
                    .findOneAndUpdate(
                        {
                            _id: new ObjectId(body.id),
                        },
                        {
                            $pull: {
                                participants: {
                                    _id: new ObjectId(body.id),
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
