import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { EventInterface } from "../../lib/events"
import { ObjectId } from "mongodb"
import { existsSync } from "fs"
import fs from "fs"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    const client = await clientPromise
    const db = await client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    if (req.method === "POST") {
        try {
            const newEvent = await db.insertOne({
                _id: new ObjectId(),
                organizer: body.organizer,
                title: body.title,
                content: body.content,
                location: body.location,
                address: body.address,
                date: new Date(body.date + "T" + body.time),
                category: body.category,
                creationDate: new Date(),
                price: Number(body.price),
                image: body.imageUrl,
                participants: [],
                editionDate: new Date(),
                likes: [],
                comments: [],
            })
            return res.status(200).json(newEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    if (req.method === "PUT") {
        try {
            const editEvent = await db.findOneAndUpdate(
                {
                    _id: new ObjectId(body._id),
                },
                {
                    $set: {
                        title: body.title,
                        content: body.content,
                        location: body.location,
                        date: new Date(body.date),
                        category: body.category.toLowerCase(),
                        editionDate: new Date(),
                        price: Number(body.price),
                    },
                }
            )
            console.log(body.date)
            return res.status(200).json(editEvent)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    if (req.method === "DELETE") {
        try {
            console.log(body._id)
            const deleteEvent = await db.deleteOne({
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
