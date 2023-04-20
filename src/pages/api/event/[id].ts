import { getEventById } from "@/lib/events"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const eventId = req.query.id
    try {
        const event = await getEventById(eventId)
        return res.status(200).json(event)
    } catch (error) {
        return res.status(400).json(error)
    }
}
