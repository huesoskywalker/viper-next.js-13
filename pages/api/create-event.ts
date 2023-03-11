import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { EventInterface } from "../../lib/events"
import { DeleteResult, InsertOneResult, ModifyResult, ObjectId } from "mongodb"
import { existsSync } from "fs"
import fs from "fs"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    // Gotta add | Unions and ModifyResult is deprecated
    // res: NextApiResponse<InsertOneResult<EventInterface>>
) {
    const body = req.body
    const organizer: {
        id: string
        name: string
        email: string
        image: string
    } = body.organizer
    const title: string = body.title
    const content: string = body.content
    const time: string = body.time
    const location: string = body.location
    const address: string = body.address
    const date: string = body.date
    const category: string = body.category
    const price: string = body.price
    const entries: string = body.entries
    const imageUrl: string = body.imageUrl
    const productId: string = body.productId

    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    if (req.method === "POST") {
        try {
            const newEvent: InsertOneResult<EventInterface> =
                await db.insertOne({
                    _id: new ObjectId(),
                    organizer: organizer,
                    title: title,
                    content: content,
                    location: location,
                    address: address,
                    date: new Date(date + "T" + time),
                    category: category,
                    creationDate: Date.now(),
                    price: Number(price),
                    entries: Number(entries),
                    image: imageUrl,
                    participants: [],
                    editionDate: Date.now(),
                    likes: [],
                    comments: [],
                    productId: productId,
                })
            return res.status(200).json(newEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    if (req.method === "PUT") {
        try {
            const editEvent: ModifyResult<EventInterface> =
                await db.findOneAndUpdate(
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
                            date: new Date(date),
                            category: category.toLowerCase(),
                            editionDate: Date.now(),
                            price: Number(price),
                        },
                    }
                )
            return res.status(200).json(editEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    if (req.method === "DELETE") {
        try {
            const deleteEvent: DeleteResult = await db.deleteOne({
                _id: new ObjectId(body._id),
            })
            if (existsSync(`public/upload/${body.image}`)) {
                fs.rmSync(`public/upload/${body.image}`)
            }
            return res.status(200).json(deleteEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
