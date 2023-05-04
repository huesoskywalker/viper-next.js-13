import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { DeleteResult, InsertOneResult, ModifyResult, ObjectId } from "mongodb"
import { existsSync } from "fs"
import fs from "fs"
import { EventInterface, Product } from "@/types/event"
import { Viper } from "@/types/viper"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    // Gotta add | Unions and ModifyResult is deprecated
    // res: NextApiResponse<InsertOneResult<EventInterface>>
) {
    const client = await clientPromise
    const db = client.db("viperDb")
    const eventCollection = db.collection<EventInterface>("events")
    const viperCollection = db.collection<Viper>("users")

    const body = req.body

    const title: string = body.title
    const content: string = body.content
    const location: string = body.location
    const date: string = body.date
    const category: string = body.category
    const price: number = body.price

    if (req.method === "POST") {
        const organizer: {
            _id: string
            name: string
            email: string
        } = body.organizer
        const address: string = body.address
        const entries: number = body.entries
        const image: string = body.image
        const product: Product = body.product

        try {
            const newEvent: InsertOneResult<EventInterface> = await eventCollection.insertOne({
                _id: new ObjectId(),
                organizer: organizer,
                title: title,
                content: content,
                location: location,
                address: address,
                date: date,
                category: category,
                creationDate: Date.now(),
                price: price,
                entries: entries,
                image: image,
                participants: [],
                editionDate: Date.now(),
                likes: [],
                comments: [],
                product: product,
            })

            const organizerEvent: ModifyResult<Viper> = await viperCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(organizer._id),
                },
                {
                    $push: {
                        "myEvents.created": {
                            _id: new ObjectId(newEvent.insertedId),
                        },
                    },
                }
            )

            return res.status(200).json([newEvent, organizerEvent])
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    if (req.method === "PUT") {
        const dateNow: number = body.dateNow
        try {
            const editEvent: ModifyResult<EventInterface> = await eventCollection.findOneAndUpdate(
                {
                    // missing giving a type to _id,
                    // entering to the endpoint as a
                    // stringify ObjectId, Want to
                    // check if does not ask me to
                    // replace quotes
                    _id: new ObjectId(body._id),
                },
                {
                    $set: {
                        title: title,
                        content: content,
                        location: location,
                        date: date,
                        category: category,
                        editionDate: dateNow,
                        price: price,
                    },
                }
            )
            return res.status(200).json(editEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    if (req.method === "DELETE") {
        // If crash on delete, it is because the declares declares outside are not requested on the body
        try {
            const deleteEvent: DeleteResult = await eventCollection.deleteOne({
                _id: new ObjectId(body.eventId),
            })
            if (existsSync(`public/upload/${body.image}`)) {
                fs.rmSync(`public/upload/${body.image}`)
            }
            const deleteEventOrganizer = await viperCollection.updateOne(
                {
                    _id: new ObjectId(body.eventOrganizerId),
                },
                {
                    $pull: {
                        "myEvents.create": { _id: new ObjectId(body.eventId) },
                    },
                }
            )
            return res.status(200).json(deleteEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    return res.status(400)
}
