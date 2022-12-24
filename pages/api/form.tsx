import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const body = req.body
        try {
            const client = await clientPromise
            const db = await client
                .db("viperDb")
                .collection("organized_events")
                .insertOne({
                    organizer: body.organizer,
                    title: body.title,
                    content: body.content,
                    location: body.location,
                    date: body.date,
                    category: body.category.toLowerCase(),
                })

            return res.end()
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    //     const body = req.body

    //     if (!body.name || !body.location || !body.date || !body.category) {
    //         return res.status(400).json({ data: "Name or last name not found" })
    //     }

    //     try {
    //         const client = await clientPromise
    //         const database = client.db("viperDb")
    //         const viper = database.collection("organized_events")

    //         const event = {
    //             organizer: body.organizer,
    //             event_name: body.name,
    //             location: body.location,
    //             date: body.date,
    //             category: body.category.toLowerCase(),
    //             comment: [],
    //             likes: [],
    //             participants: [],
    //         }

    //         const response = await viper.insertOne(event)
    //         res.json(response)
    //     } catch (error) {
    //         console.error(error)
    //     }
}
