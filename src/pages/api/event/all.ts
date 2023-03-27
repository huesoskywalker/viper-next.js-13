import { getAllEvents } from "@/lib/events"
import { EventInterface } from "@/types/event"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const allEvents: EventInterface[] = await getAllEvents()
        return res.status(200).json(allEvents)
    } catch (error) {
        return res.status(400).json(error)
    }
}
